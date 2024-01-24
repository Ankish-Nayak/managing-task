import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SignUpFeedback } from '../../../shared/models/feedback/signupFeedback.model';
const VALIDATION_MESSAGES = {
  name: {
    required: 'Required',
  },
  email: {
    required: 'Required',
    email: 'Invalid email address',
  },
  address: {
    required: 'Required',
  },
  country: {
    required: 'Required',
    pattern: 'Alphabets only',
  },
  phone: {
    required: 'Required',
    pattern: 'Numbers only',
  },
  departmentId: {
    required: 'Required',
  },
};

type IPropertyName =
  | 'name'
  | 'email'
  | 'address'
  | 'country'
  | 'phone'
  | 'departmentId';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  feedback: SignUpFeedback = new SignUpFeedback();
  constructor() {}
  ngOnInit(): void {
    this.signupFormInit();
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
      departmentId: new FormControl('', [Validators.required]),
    });
  }
  onSubmit(e: SubmitEvent) {
    e.preventDefault();
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
      // not valid

      style = style + ' is-invalid';
      // if(VALIDATION_MESSAGES.hasOwnProperty(propertyName)){
      //   const messages = VALIDATION_MESSAGES[propertyName];
      //   for(const message in messages){
      //     if(property.errors?.hasOwnProperty(message) && this.feedback.hasOwnProperty(message)){
      //       VALIDATION_MESSAGES[propertyName][message];
      //     }
      //   }
      // }
    }
    return style;
  }
  validEmail() {
    const email = this.formValue('email');
    if(email.errors?.['required']){
      this.feedback.email = VALIDATION_MESSAGES.email.required;
    }else if(email.errors?.['email']){
      this.feedback.email = VALIDATION_MESSAGES.email.email;
    }
  }
  validName(){
    const name = this.formValue('name');
    if(name.)
  }
  formValue(propertyName: IPropertyName) {
    return this.signupForm.get(propertyName)!;
  }
}
