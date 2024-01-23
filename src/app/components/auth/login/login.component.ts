import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginFeedback } from '../../../shared/models/feedback/loginFeedback.model';
import { AuthService } from '../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  feedback: LoginFeedback = new LoginFeedback('', '');
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.formInit();
  }
  formInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
  onSubmit(e: SubmitEvent) {
    e.preventDefault();
    const { email, password } = this.loginForm.value;

    this.router.navigate(['', 'dashboard']);
    this.authService.login(email, password).subscribe((res) => {
      console.log(res);
      this.router.navigate(['', 'dashboard']);
    });
  }
  neitherTouchedNorDirty(element: AbstractControl<any, any>) {
    return !(element.touched && element.dirty);
  }
  validEmail() {
    const email = this.email;
    let style = 'form-control';
    if (email === null || !(email.touched && email.dirty)) {
      return style;
    } else {
      if (email.valid) {
        style = style + ' is-valid';
      } else {
        this.feedback.email = 'Invalid email address.';
        style = style + ' is-invalid';
      }
      return style;
    }
  }
  validPassword() {
    const password = this.password;
    let style = 'form-control';
    if (password === null || !(password.touched && password.dirty)) {
      return style;
    } else {
      if (password.valid) {
        style = style + ' is-valid';
      } else {
        this.feedback.password = 'Password must ot least 6 chars';
        style = style + ' is-invalid';
      }
      return style;
    }
  }
  get email() {
    return this.loginForm.get('email')!;
  }
  get password() {
    return this.loginForm.get('password')!;
  }
}
