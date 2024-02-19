import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, Subscription, debounceTime, fromEvent, merge } from 'rxjs';
import { ISignupPostData } from '../../../shared/interfaces/requests/signup.interface';
import { Department } from '../../../shared/models/department.model';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { DepartmentService } from '../../../shared/services/department/department.service';
import { GenericValidators } from '../../../shared/validators/generic-validator';
import { notNullValidator } from '../../../shared/validators/not-null-validators';
import { END_POINTS } from '../../../utils/constants';
import { validationMessages } from './validationMessages';

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
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit, AfterViewInit, OnDestroy {
  public signupForm!: FormGroup;
  // returns the query list of FormControlName
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  public displayFeedback: { [key in IPropertyName]?: string } = {};
  public employees: { name: string; value: number }[] = [
    { name: 'Employee', value: 0 },
    { name: 'Admin', value: 1 },
  ];

  public departments!: Department[];

  public adminRegistration: boolean = false;

  private validatioMessages!: { [key: string]: { [key: string]: string } };
  private genericValidator!: GenericValidators;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
  ) {
    // defining validation messages here.
    this.validatioMessages = validationMessages;

    this.genericValidator = new GenericValidators(this.validatioMessages);
  }
  ngOnInit(): void {
    this.getDepartments();
    if (this.getActiveEndpoint() === `./${END_POINTS.createAdmin}`) {
      this.adminRegistration = true;
    } else {
      this.adminRegistration = false;
    }
    this.signupFormInit();
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
      // 0 -> means employee
      // 1 -> means admin
      employeeType: new FormControl(this.adminRegistration ? 1 : 0, [
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]+$',
        ),
        Validators.minLength(8),
      ]),
    });
  }

  private getDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res.map(
          (d) => new Department(d.id, d.departmentName, d.employeesCount),
        );
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {},
    });
  }
  public onSubmit(e: SubmitEvent) {
    e.preventDefault();
    // Mark all form as touched to trigger validation messages
    this.markAsTouchedAndDirty();
    //TODO: replace it from hard code.
    //
    //
    //email: "anil1@gmail.com"
    //password: "Anil@123"
    // const data = { ...this.signupForm.value, departmentID: 1 };
    const {
      name,
      email,
      address,
      country,
      phone,
      departmentID,
      city,
      employeeType,
      password,
    } = this.signupForm.value;
    const data: ISignupPostData = {
      name,
      email,
      country,
      phone,
      departmentID: Number(departmentID),
      city,
      employeeType,
      password,
      address,
    };

    if (this.signupForm.valid) {
      const subscription = this.authService.signup(data).subscribe({
        next: () => {
          if (this.adminRegistration) {
            this.router.navigate(['', END_POINTS.adminList]);
          } else {
            this.router.navigate(['', END_POINTS.dashboard.toString()]);
          }
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {},
      });
      this.subscriptions.push(subscription);
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
  public formValue(propertyName: IPropertyName) {
    return this.signupForm.get(propertyName)!;
  }
  public markAsTouchedAndDirty() {
    Object.values(this.signupForm.controls).forEach((control) => {
      if (!control.disabled) {
        control.markAsTouched();
        control.markAsDirty();
      }
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    });
  }
}
