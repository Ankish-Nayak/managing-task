import { CommonModule, JsonPipe } from '@angular/common';
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, debounceTime, fromEvent, merge } from 'rxjs';
import { Department } from '../../shared/models/department.model';
import { Employee } from '../../shared/models/employee.model';
import { AuthService } from '../../shared/services/auth/auth.service';
import { DepartmentService } from '../../shared/services/department/department.service';
import { GenericValidators } from '../../shared/validators/generic-validator';
import { notNullValidator } from '../../shared/validators/not-null-validators';
import { END_POINTS } from '../../utils/constants';

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
  selector: 'app-profile',
  standalone: true,
  imports: [JsonPipe, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  profile!: Employee;
  signupForm!: FormGroup;
  // returns the query list of FormControlName
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  displayFeedback: { [key in IPropertyName]?: string } = {};
  employees: { name: string; value: number }[] = [
    { name: 'Employee', value: 0 },
    { name: 'Admin', value: 1 },
  ];

  departments!: Department[];

  adminRegistration: boolean = false;

  private validatioMessages!: { [key: string]: { [key: string]: string } };
  private genericValidator!: GenericValidators;

  constructor(
    private authService: AuthService,
    private router: Router,
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
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
    this.getDepartments();
    console.log('endpoint', this.getActiveEndpoint());
    if (this.getActiveEndpoint() === `./${END_POINTS.createAdmin}`) {
      console.log('yess');
      this.adminRegistration = true;
    } else {
      this.adminRegistration = false;
    }
    this.signupFormInit();

    this.authService.profile().subscribe((res) => {
      this.profile = res;
    });
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

  getDepartments() {
    this.departmentService.getDepartments().subscribe((res) => {
      this.departments = res.map((d) => new Department(d.id, d.departmentName));
    });
  }
  onSubmit(e: SubmitEvent) {
    e.preventDefault();
    // Mark all form as touched to trigger validation messages
    this.markAsTouchedAndDirty();
    //TODO: replace it from hard code.
    //
    //
    //email: "anil1@gmail.com"
    //password: "Anil@123"
    // const data = { ...this.signupForm.value, departmentID: 1 };
    const data = this.signupForm.value;

    if (this.signupForm.valid) {
      console.log('inputs: ', data);
      this.authService.signup(data).subscribe((res) => {
        if (this.adminRegistration) {
          this.router.navigate(['', END_POINTS.adminList]);
        } else {
          this.router.navigate(['', END_POINTS.dashboard.toString()]);
        }

        console.log(res);
      });
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
