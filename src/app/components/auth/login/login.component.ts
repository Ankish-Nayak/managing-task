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
import { Router, RouterLink } from '@angular/router';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SpinnerComponent } from '../../../shared/components/spinners/spinner/spinner.component';
import { SubmitSpinnerComponent } from '../../../shared/components/spinners/submit-spinner/submit-spinner.component';
import { ClickedEnterDirective } from '../../../shared/directives/clicked-enter/clicked-enter.directive';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { GenericValidators } from '../../../shared/validators/generic-validator';
import { validationMessages } from '../signup/validationMessages';

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
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
  public loginForm!: FormGroup;
  public displayFeedback: { [key in IPropertyName]?: string } = {};
  public isSubmitLoading: boolean = false;

  private validationMessages!: { [key: string]: { [key: string]: string } };
  private genericValidator!: GenericValidators;
  private subscriptions: Subscription[] = [];
  constructor(
    private authService: AuthService,
    private router: Router,
    public toastService: ToastService,
  ) {
    this.validationMessages = validationMessages;

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

  private formInit() {
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
  public onSubmit() {
    // mark as touched and dirty
    this.markAsTouchedAndDirty();
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.isSubmitLoading = true;
      const subscription = this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['', 'dashboard']);
        },
        error: (e) => {
          this.toastService.show(
            'Unauthorized',
            'Invalid email or password',
            'error',
          );
          console.log(e);
        },
        complete: () => {
          this.isSubmitLoading = false;
        },
      });
      this.subscriptions.push(subscription);
    } else {
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
    return this.loginForm.get(propertyName)!;
  }
  private markAsTouchedAndDirty() {
    Object.values(this.loginForm.controls).forEach((control) => {
      control.markAsDirty();
      control.markAsTouched();
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    });
  }
}
