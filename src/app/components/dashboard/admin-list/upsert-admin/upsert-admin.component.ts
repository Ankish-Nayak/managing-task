import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
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
import { Observable, debounceTime, fromEvent, merge } from 'rxjs';
import { Department } from '../../../../shared/models/department.model';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { DepartmentService } from '../../../../shared/services/department/department.service';
import { EmployeeService } from '../../../../shared/services/employee/employee.service';
import { GenericValidators } from '../../../../shared/validators/generic-validator';
import { notNullValidator } from '../../../../shared/validators/not-null-validators';
import { EMPLOYEE_TYPE, END_POINTS } from '../../../../utils/constants';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { Employee } from '../../../../shared/models/employee.model';
import { IUpdateEmpoyee } from '../../../../shared/interfaces/requests/employee.interface';
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
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './upsert-admin.component.html',
  styleUrl: './upsert-admin.component.scss',
})
export class UpsertAdminComponent implements OnInit, AfterViewInit {
  signupForm!: FormGroup;
  // returns the query list of FormControlName
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  displayFeedback: { [key in IPropertyName]?: string } = {};
  employees: { name: string; value: number }[] = [
    { name: 'Employee', value: 0 },
    { name: 'Admin', value: 1 },
  ];

  employee!: Employee;
  departments!: Department[];
  id!: string;

  adminRegistration: boolean = false;

  private validatioMessages!: { [key: string]: { [key: string]: string } };
  private genericValidator!: GenericValidators;

  constructor(
    private authService: AuthService,
    private router: Router,
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private toastService: ToastService,
  ) {
    // defining validation messages here.
    this.validatioMessages = {
      email: {
        required: 'Required',
        email: 'Invalid email address',
      },
      name: {
        required: 'Required',
      },
      city: {
        required: 'Required',
      },
      address: {
        required: 'Required',
      },
      country: {
        pattern: 'Must be alphabets.',
        required: 'Required',
      },
      phone: {
        pattern: 'Must be numbers.',
        required: 'Required',
      },
      departmentID: {
        required: 'Required',
        notNull: 'Select department',
      },
      employeeType: {
        required: 'Required',
        allowedvalue: 'Select from dropdown',
      },
      password: {
        required: 'Required',
        minlength: 'Must be of atleast 8 chars.',
        pattern:
          'Must contain at least one uppercase letter, one digit, and one special character',
      },
    };

    this.genericValidator = new GenericValidators(this.validatioMessages);
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.id = id;
      }
    });

    this.employeeService.getEmployee(Number(this.id)).subscribe((res) => {
      this.employee = res;
    });

    this.getDepartments();
    console.log('endpoint', this.getActiveEndpoint());
    if (this.getActiveEndpoint() === `./${END_POINTS.createAdmin}`) {
      console.log('yess');
      this.adminRegistration = true;
    } else {
      this.adminRegistration = false;
    }
    this.signupFormInit();
    //FIXME: disabling departmentID has stoped value to detected.
    // this.disabling('departmentID');
  }

  ngAfterViewInit(): void {
    // blur events.
    const controlsBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'),
    );

    merge(this.signupForm.valueChanges, ...controlsBlurs)
      .pipe(debounceTime(800))
      .subscribe(() => {
        this.displayFeedback = this.genericValidator.processMessages(
          this.signupForm,
        );
      });
  }

  getActiveEndpoint() {
    // Get the current activated route
    let currentRoute = this.route;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    // Get the URL segments of the activated route
    const urlSegments = currentRoute.snapshot.url.map(
      (segment) => segment.path,
    );

    // Determine the active endpoint based on the URL segments
    const activeEndpoint = '/' + urlSegments.join('/');
    return `.${activeEndpoint}`;
  }
  disabling(propertyName: IPropertyName) {
    this.signupForm.get(propertyName)?.disable();
  }

  signupFormInit() {
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
      // 0 -> means employee
      // 1 -> means admin
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
      // const employee: Employee = JSON.parse(
      //   this.employeeService.getEmployee(Number(this.id)),
      // );
      // console.log(employee);
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
        // 0 -> means employee
        // 1 -> means admin
        // 2 -> super admin
        employeeType: new FormControl(EMPLOYEE_TYPE.admin, [
          Validators.required,
        ]),
      });
    }
  }

  getDepartments() {
    this.departmentService.getDepartments().subscribe((res) => {
      this.departments = res.map((d) => new Department(d.id, d.departmentName));
      if (!this.adminRegistration) {
        this.departments = this.departments.filter(
          (d) => this.employee.departmentID !== d.id,
        );
        this.departments.push(
          new Department(
            this.employee.departmentID,
            this.employee.departmentName,
          ),
        );
        console.log(this.departments);
      }
    });
  }
  onSubmit(e: SubmitEvent) {
    e.preventDefault();
    // Mark all form as touched to trigger validation messages
    this.markAsTouchedAndDirty();
    //TODO: replace it from hard code.

    if (this.signupForm.valid) {
      if (this.adminRegistration) {
        const data = this.signupForm.value;
        console.log('inputs: ', data);
        this.authService.signup(data).subscribe((res) => {
          if (this.adminRegistration) {
            this.router.navigate([`../${END_POINTS.adminList}`], {
              relativeTo: this.route,
            });
          } else {
            this.router.navigate(['', END_POINTS.dashboard.toString()]);
          }
          console.log(res);
        });
      } else {
        const data: IUpdateEmpoyee = {
          ...this.signupForm.value,
          id: this.id,
          employeeType: Number(this.signupForm.value.employeeType),
          departmentName: this.departments.find(
            (d) =>
              d.id.toString() === this.signupForm.get('departmentID')?.value.id,
          )?.name,
        };
        this.employeeService.updateEmployee(Number(this.id), data).subscribe(
          () => {
            this.toastService.show(
              'Admin Updatation',
              'Admin has been updated',
              'success',
            );
          },
          () => {
            this.toastService.show(
              'Admin Updatation',
              'Failed to update admin',
              'error',
            );
          },
        );
      }
    }
  }
  neitherTouchedNorDirty(element: AbstractControl<any, any>) {
    return !(element.touched && element.dirty);
  }
  validProperty(propertyName: IPropertyName) {
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
  formValue(propertyName: IPropertyName) {
    return this.signupForm.get(propertyName)!;
  }
  markAsTouchedAndDirty() {
    Object.values(this.signupForm.controls).forEach((control) => {
      if (!control.disabled) {
        control.markAsTouched();
        control.markAsDirty();
      }
    });
  }
}
