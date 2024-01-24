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
import { Router, RouterLink } from '@angular/router';
import { Observable, debounceTime, fromEvent, merge } from 'rxjs';
import { GenericValidators } from '../../../shared/validators/generic-validator';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { END_POINTS } from '../../../utils/constants';

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
export class SignupComponent implements OnInit, AfterViewInit {
  signupForm!: FormGroup;
  // returns the query list of FormControlName
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  displayFeedback: { [key in IPropertyName]?: string } = {};
  employees: { name: string; value: number }[] = [
    { name: 'Employee', value: 0 },
    { name: 'Admin', value: 1 },
  ];

  private validatioMessages!: { [key: string]: { [key: string]: string } };
  private genericValidator!: GenericValidators;

  constructor(
    private authService: AuthService,
    private router: Router,
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
      departmentId: {
        required: 'Required',
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
    this.signupFormInit();
    //FIXME: disabling departmentID has stoped value to detected.
    this.disabling('departmentID');
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
        Validators.pattern(/^[0-9]+$/),
      ]),
      departmentID: new FormControl('1', [Validators.required]),
      employeeType: new FormControl(0, [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]+$',
        ),
        Validators.minLength(8),
      ]),
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
    const data = { ...this.signupForm.value, departmentID: 1 };

    console.log('inputs: ', data);
    if (this.signupForm.valid) {
      this.authService.signup(data).subscribe((res) => {
        this.router.navigate(['', END_POINTS.dashboard.toString()]);
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
