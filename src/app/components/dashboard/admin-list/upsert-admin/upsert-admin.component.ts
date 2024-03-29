import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChildren,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormControlName,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, debounceTime, fromEvent, merge } from 'rxjs';
import { SpinnerComponent } from '../../../../shared/components/spinners/spinner/spinner.component';
import { SubmitSpinnerComponent } from '../../../../shared/components/spinners/submit-spinner/submit-spinner.component';
import { ClickedEnterDirective } from '../../../../shared/directives/clicked-enter/clicked-enter.directive';
import { IUpdateEmpoyee } from '../../../../shared/interfaces/requests/employee.interface';
import {
  Department,
  DepartmentAdapter,
} from '../../../../shared/models/department.model';
import { Employee } from '../../../../shared/models/employee.model';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { DepartmentService } from '../../../../shared/services/department/department.service';
import { EmployeeService } from '../../../../shared/services/employee/employee.service';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { GenericValidators } from '../../../../shared/validators/generic-validator';
import { notNullValidator } from '../../../../shared/validators/not-null-validators';
import { EMPLOYEE_TYPE, END_POINTS } from '../../../../utils/constants';
import { getActiveEndpoint } from '../../../../utils/getActiveEndpoint';
import { VALIDATION_MESSAGES } from './VALIDATION_MESSAGES';
type IPropertyName =
  | 'name'
  | 'email'
  | 'address'
  | 'country'
  | 'phone'
  | 'departmentID'
  | 'city'
  | 'employeeType'
  | 'password';

@Component({
  selector: 'app-upsert-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SpinnerComponent,
    ClickedEnterDirective,
    SubmitSpinnerComponent,
  ],
  templateUrl: './upsert-admin.component.html',
  styleUrl: './upsert-admin.component.scss',
})
export class UpsertAdminComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef })
  private formInputElements!: ElementRef[];
  @Input() public id!: string;
  @Input() public displayTitle: boolean = true;
  @Input({ alias: 'updateForm', transform: (value: boolean) => !value })
  public adminRegistration: boolean = true;
  @Output() private updated: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  public isLoading: boolean = true;
  public signupForm!: FormGroup;
  // returns the query list of FormControlName
  public displayFeedback: { [key in IPropertyName]?: string } = {};
  public employees: { name: string; value: number }[] = [
    { name: 'Employee', value: 0 },
    { name: 'Admin', value: 1 },
  ];
  public isSubmitLoading = false;
  public departments!: Department[];

  private subscriptions: Subscription[] = [];
  private employee!: Employee;
  private endPoint: string = '';
  private validatioMessages!: { [key: string]: { [key: string]: string } };
  private genericValidator!: GenericValidators;

  constructor(
    private authService: AuthService,
    private router: Router,
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private departmentAdapter: DepartmentAdapter,
  ) {
    // defining validation messages here.
    this.validatioMessages = VALIDATION_MESSAGES;
    this.genericValidator = new GenericValidators(this.validatioMessages);
  }
  ngOnInit(): void {
    const subscription1 = this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.id = id;
      }
    });
    const subscription2 = this.employeeService
      .getEmployee(Number(this.id))
      .subscribe((res) => {
        this.employee = res;
      });
    this.subscriptions.push(...[subscription2, subscription1]);

    this.getDepartments();
    if (getActiveEndpoint(this.route) === `./${END_POINTS.updateAdmin}`) {
      this.endPoint = getActiveEndpoint(this.route);
      this.adminRegistration = false;
    }
    this.signupFormInit();
  }

  ngAfterViewInit(): void {
    // blur events.
    const controlsBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'),
    );

    const subscription = merge(this.signupForm.valueChanges, ...controlsBlurs)
      .pipe(debounceTime(800))
      .subscribe(() => {
        this.displayFeedback = this.genericValidator.processMessages(
          this.signupForm,
        );
      });
    this.subscriptions.push(subscription);
  }

  public reset() {
    this.signupFormInit();
  }

  private signupFormInit() {
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      country: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]+$/),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?:\+\d{1,3}\s?)?(?:\(\d{1,4}\)|\d{1,4})(?:[-.\s]?\d{1,12})+$/,
        ),
      ]),
      departmentID: new FormControl('null', [
        Validators.required,
        notNullValidator(),
      ]),
      employeeType: new FormControl(EMPLOYEE_TYPE.admin, [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]+$',
        ),
        Validators.minLength(8),
      ]),
    });
    // TODO: can not pass pass therefore not able to create update admin from super admin side
    if (!this.adminRegistration) {
      this.signupForm = new FormGroup({
        name: new FormControl(this.employee.name, [Validators.required]),
        email: new FormControl(this.employee.email, [
          Validators.required,
          Validators.email,
        ]),
        address: new FormControl(this.employee.address, [Validators.required]),
        city: new FormControl(this.employee.city, [Validators.required]),
        country: new FormControl(this.employee.country, [
          Validators.required,
          Validators.pattern(/^[a-zA-Z]+$/),
        ]),
        phone: new FormControl(this.employee.phone, [
          Validators.required,
          Validators.pattern(
            /^(?:\+\d{1,3}\s?)?(?:\(\d{1,4}\)|\d{1,4})(?:[-.\s]?\d{1,12})+$/,
          ),
        ]),
        departmentID: new FormControl(String(this.employee.departmentID), [
          Validators.required,
          notNullValidator(),
        ]),
        employeeType: new FormControl(EMPLOYEE_TYPE.admin, [
          Validators.required,
        ]),
      });
    }
  }

  private getDepartments() {
    const subscription = this.departmentService
      .getDepartments()
      .subscribe((res) => {
        this.departments = this.departmentAdapter.adaptArray(res);
        if (!this.adminRegistration) {
          this.departments = this.departments.filter(
            (d) => this.employee.departmentID !== d.id,
          );
          this.departments.push(
            new Department(
              this.employee.departmentID,
              this.employee.departmentName,
              0,
            ),
          );
        }
        this.isLoading = false;
      });
    this.subscriptions.push(subscription);
  }
  public onSubmit() {
    // Mark all form as touched to trigger validation messages
    this.markAsTouchedAndDirty();

    if (this.signupForm.valid) {
      this.isSubmitLoading = true;
      if (this.adminRegistration) {
        const data = this.signupForm.value;
        const subscription = this.authService.signup(data).subscribe({
          next: () => {
            this.updated.emit(true);
            if (this.endPoint == `./${END_POINTS.createAdmin}`) {
              this.router.navigate([`../${END_POINTS.adminList}`], {
                relativeTo: this.route,
              });
            }
          },
          error: (e) => {
            console.log(e);
          },
          complete: () => {
            this.isSubmitLoading = false;
          },
        });
        this.subscriptions.push(subscription);
      } else {
        const departmentName = this.departments.find(
          (d) => d.id.toString() === this.signupForm.value.departmentID,
        )?.departmentName;
        const data: IUpdateEmpoyee = {
          ...this.signupForm.value,
          id: this.id,
          employeeType: Number(this.signupForm.value.employeeType),
          departmentName,
        };
        const subscription = this.employeeService
          .updateEmployee(Number(this.id), data)
          .subscribe({
            next: () => {
              this.updated.emit(true);
              if (this.endPoint === `./${END_POINTS.updateAdmin}`) {
                this.router.navigate(['', END_POINTS.portal.toString()]);
              }

              this.toastService.show(
                'Admin Updatation',
                'Admin has been updated',
                'success',
              );
            },
            error: (e) => {
              console.log(e);
              this.toastService.show(
                'Admin Updatation',
                'Failed to update admin',
                'error',
              );
            },
            complete: () => {
              this.isSubmitLoading = false;
            },
          });
        this.subscriptions.push(subscription);
      }
    }
  }
  private neitherTouchedNorDirty(element: AbstractControl<any, any>) {
    return !(element.touched && element.dirty);
  }
  public validProperty(propertyName: IPropertyName) {
    let style = 'form-control';
    const property = this.formValue(propertyName);
    if (this.neitherTouchedNorDirty(property)) {
      return style;
    } else if (property.valid) {
      style = style + ' is-valid';
    } else {
      style = style + ' is-invalid';
    }
    return style;
  }
  private formValue(propertyName: IPropertyName) {
    return this.signupForm.get(propertyName)!;
  }
  private markAsTouchedAndDirty() {
    Object.values(this.signupForm.controls).forEach((control) => {
      if (!control.disabled) {
        control.markAsTouched();
        control.markAsDirty();
      }
    });
  }
  public onClickedEnter() {
    this.onSubmit();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
