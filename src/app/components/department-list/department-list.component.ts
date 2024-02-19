import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
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
import { Observable, Subscription, debounceTime, fromEvent, merge } from 'rxjs';
import { ConfirmationModalComponent } from '../../shared/components/modals/confirmation-modal/confirmation-modal.component';
import { TEmployee } from '../../shared/interfaces/employee.type';
import { Department } from '../../shared/models/department.model';
import { AuthService } from '../../shared/services/auth/auth.service';
import { DepartmentService } from '../../shared/services/department/department.service';
import { GenericValidators } from '../../shared/validators/generic-validator';
import { allowedToView } from '../../utils/allowedToView';
import { UserRole } from '../../utils/constants';
import { DepartmentComponent } from './department/department.component';

type IPropertyName = 'departmentName';
@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DepartmentComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss',
})
export class DepartmentListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  readonly allowedToView = allowedToView;
  readonly UserRole = UserRole;
  @ViewChildren(FormControlName, { read: ElementRef })
  private formInputElements!: ElementRef[];
  public isLoading: boolean = true;
  public departments!: Department[];
  departmentForm!: FormGroup;
  public deleteDepartmentEvent: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  public userType!: TEmployee;
  public displayFeedback: { [key in IPropertyName]?: string } = {};
  public subscriptions: Subscription[] = [];
  private validatioMessages!: { [key: string]: { [key: string]: string } };
  private genericValidator!: GenericValidators;
  private departmentIdTobeDeleted!: number | null;

  constructor(
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
    this.validatioMessages = {
      departmentName: {
        required: 'Required.',
        pattern: 'Must contains only aplhabets.',
      },
    };
    this.genericValidator = new GenericValidators(this.validatioMessages);
  }
  ngOnInit(): void {
    this.getDepartments();
    this.getUserType();
  }
  private getUserType() {
    const subscription = this.authService.userTypeMessage$.subscribe((res) => {
      if (res !== null) {
        this.userType = res;
      }
    });
    this.subscriptions.push(subscription);
  }
  public userRole() {
    const subscription = this.authService.userTypeMessage$.subscribe((res) => {
      console.log(res);
    });
    this.subscriptions.push(subscription);
  }
  ngAfterViewInit(): void {
    this.departmentFormInit();

    const controlsBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'),
    );

    const subscription = merge(
      this.departmentForm.valueChanges,
      ...controlsBlurs,
    )
      .pipe(debounceTime(800))
      .subscribe(() => {
        this.displayFeedback = this.genericValidator.processMessages(
          this.departmentForm,
        );
      });
    this.subscriptions.push(subscription);
  }

  public deleteDepartment(id: number) {
    this.departmentIdTobeDeleted = id;
  }

  public confirm(confirmation: boolean) {
    if (confirmation && this.departmentIdTobeDeleted !== null) {
      const subscription = this.departmentService
        .deleteDepartment(this.departmentIdTobeDeleted)
        .subscribe((res) => {
          console.log(res);
          this.isLoading = true;
          this.getDepartments();
        });
      this.subscriptions.push(subscription);
    }
  }

  public createDepartment() {
    const data = this.departmentForm.value;
    this.departmentService.createDepartment(data).subscribe({
      next: () => {
        this.departmentFormInit();
        this.getDepartments();
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.isLoading = true;
      },
    });
  }

  private departmentFormInit() {
    this.departmentForm = new FormGroup({
      departmentName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]+$/),
      ]),
    });
  }
  public onViewEmployeesByDepartment(id: number) {
    this.router.navigate([`../employees-by-department/${id}`], {
      relativeTo: this.route,
    });
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
    return this.departmentForm.get(propertyName)!;
  }
  public updateDepartment(_id: number) {}

  public getDepartments() {
    const subscription = this.departmentService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res.map(
          (d) => new Department(d.id, d.departmentName, d.employeesCount),
        );
      },
      error: (e) => {
        console.log(e);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
    this.subscriptions.push(subscription);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
