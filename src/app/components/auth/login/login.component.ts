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
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { Observable, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SpinnerComponent } from '../../../shared/components/spinners/spinner/spinner.component';
import { SubmitSpinnerComponent } from '../../../shared/components/spinners/submit-spinner/submit-spinner.component';
import { ClickedEnterDirective } from '../../../shared/directives/clicked-enter/clicked-enter.directive';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { GenericValidators } from '../../../shared/validators/generic-validator';

type IPropertyName = 'email' | 'password';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NgbToast,
    SpinnerComponent,
    SubmitSpinnerComponent,
    ClickedEnterDirective,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
  loginForm!: FormGroup;
  displayFeedback: { [key in IPropertyName]?: string } = {};
  errorMessage: any;
  isSubmitLoading: boolean = false;

  private validationMessages!: { [key: string]: { [key: string]: string } };
  private genericValidator!: GenericValidators;
  constructor(
    private authService: AuthService,
    private router: Router,
    public toastService: ToastService,
  ) {
    // defining validationMessages here.
    this.validationMessages = {
      email: {
        required: 'Required',
        email: 'Invalid email address',
      },
      password: {
        required: 'Required',
        minlength: 'Must be of atleast 8 chars.',
        pattern:
          'Must contain at least one uppercase letter, one digit, and one special character',
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
        Validators.pattern(
          '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]+$',
        ),
        Validators.minLength(8),
      ]),
    });
  }
  onSubmit() {
    // mark as touched and dirty
    this.markAsTouchedAndDirty();
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.isSubmitLoading = true;
      this.authService.login(email, password).subscribe(
        () => {
          this.router.navigate(['', 'dashboard']);
        },
        (e) => {
          this.errorMessage = e;
          this.toastService.show(
            'Unauthorized',
            'Invalid email or password',
            'error',
          );
          console.log(e);
        },
        () => {
          this.isSubmitLoading = false;
        },
      );
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
