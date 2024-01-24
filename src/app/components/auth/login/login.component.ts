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
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { GenericValidators } from '../../../shared/validators/generic-validator';

type IPropertyName = 'email' | 'password';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
  loginForm!: FormGroup;
  displayFeedback: { [key in IPropertyName]?: string } = {};
  private validationMessages!: { [key: string]: { [key: string]: string } };
  private genericValidator!: GenericValidators;
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    // defining validationMessages here.
    this.validationMessages = {
      email: {
        required: 'Required',
        email: 'Invalid email address',
      },
      password: {
        required: 'Required',
        minlength: 'Password must of atleast 6',
      },
    };

    this.genericValidator = new GenericValidators(this.validationMessages);
  }
  ngOnInit(): void {
    this.formInit();
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'),
    );

    merge(this.loginForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(800))
      .subscribe(() => {
        this.displayFeedback = this.genericValidator.processMessages(
          this.loginForm,
        );
      });
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
    // mark as touched and dirty
    this.markAsTouchedAndDirty();
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe((res) => {
        console.log(res);
        this.router.navigate(['', 'dashboard']);
      });
    } else {
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
    return this.loginForm.get(propertyName)!;
  }
  markAsTouchedAndDirty() {
    Object.values(this.loginForm.controls).forEach((control) => {
      control.markAsDirty();
      control.markAsTouched();
    });
  }
}
