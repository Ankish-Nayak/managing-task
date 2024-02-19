import { CommonModule, JsonPipe } from '@angular/common';
import {
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  debounceTime,
  fromEvent,
  merge,
} from 'rxjs';
import { SaveChangesModalComponent } from '../../shared/components/modals/save-changes-modal/save-changes-modal.component';
import { SubmitSpinnerComponent } from '../../shared/components/spinners/submit-spinner/submit-spinner.component';
import { ClickedEnterDirective } from '../../shared/directives/clicked-enter/clicked-enter.directive';
import { BlockNavigationIfChange } from '../../shared/interfaces/hasChanges/BlockNavigationIfChange';
import { IEmployee } from '../../shared/interfaces/requests/employee.interface';
import { Department } from '../../shared/models/department.model';
import { Employee } from '../../shared/models/employee.model';
import { AuthService } from '../../shared/services/auth/auth.service';
import { DepartmentService } from '../../shared/services/department/department.service';
import { GenericValidators } from '../../shared/validators/generic-validator';
import { notNullValidator } from '../../shared/validators/not-null-validators';
import { UPDATE_PROFILE_VALIDAION_MESSAGES } from './validationMessages';

type IPropertyName =
  | 'name'
  | 'email'
  | 'address'
  | 'country'
  | 'phone'
  | 'departmentID'
  | 'city'
  | 'employeeType'
  | 'departmentName';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    JsonPipe,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ClickedEnterDirective,
    SubmitSpinnerComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent
  implements OnInit, BlockNavigationIfChange, OnDestroy
{
  @ViewChildren(FormControlName, { read: ElementRef })
  private formInputElements!: ElementRef[];
  private _hasUnSavedChangesSource = new BehaviorSubject<boolean>(false);
  public hasUnSavedChanges$: Observable<boolean> =
    this._hasUnSavedChangesSource.asObservable();
  public isLoading: boolean = true;
  public isSubmitLoading: boolean = false;
  public profile: Employee = new Employee(
    0,
    '',
    '',
    0,
    '',
    '',
    '',
    '',
    0,
    '',
    '',
    '',
  );
  public updateProfileForm!: FormGroup;
  public displayFeedback: { [key in IPropertyName]?: string } = {};
  public employees: { name: string; value: number }[] = [
    { name: 'Employee', value: 0 },
    { name: 'Admin', value: 1 },
  ];
  public cardBodyHeader: string[] = ['card-body-header'];
  public departments!: Department[];
  public updatingProfile: boolean = false;
  private validatioMessages!: { [key: string]: { [key: string]: string } };
  private genericValidator!: GenericValidators;
  private formInitailValue!: string;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private departmentService: DepartmentService,
    private modalService: NgbModal,
    private router: Router,
  ) {
    // defining validation messages here.
    this.validatioMessages = UPDATE_PROFILE_VALIDAION_MESSAGES;
    this.genericValidator = new GenericValidators(this.validatioMessages);
  }
  ngOnInit(): void {
    this.profileComponentInit();
  }
  private profileComponentInit() {
    this.isLoading = true;
    this.getDepartments();

    this.updateProfileFormInit();
    this.getProfile();
    this.toggleForm();
  }

  private getProfile() {
    const subscription = this.authService.profile().subscribe((res) => {
      this.profile = res;
      this.updateProfileForm.patchValue(this.profile);
      // this.formInitailValue = JSON.stringify(res);
      this.isLoading = false;
    });
    this.subscriptions.push(subscription);
  }

  ngAfterViewInit(): void {
    // blur events.
    const controlsBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'),
    );

    const subscription = merge(
      this.updateProfileForm.valueChanges,
      ...controlsBlurs,
    )
      .pipe(debounceTime(800))
      .subscribe(() => {
        this.displayFeedback = this.genericValidator.processMessages(
          this.updateProfileForm,
        );
      });
    this.subscriptions.push(subscription);
  }
  private enableAllowedField(fields: IPropertyName[]) {
    fields.forEach((field) => {
      if (this.updateProfileForm.get(field)?.disabled) {
        this.updateProfileForm.get(field)?.enable();
      }
    });
  }
  private toggleForm() {
    if (!this.updateProfileForm.disabled) {
      this.cardBodyHeader = this.cardBodyHeader.filter((v) => v !== 'visible');
      this.cardBodyHeader.push('invisible');
      this.updateProfileForm.reset(this.profile);
      this.updateProfileForm.disable();
      this.updatingProfile = false;
    } else {
      this.cardBodyHeader = this.cardBodyHeader.filter(
        (v) => v !== 'invisible',
      );
      this.cardBodyHeader.push('visible');
      this.updatingProfile = true;

      this.enableAllowedField(['phone', 'city', 'country', 'address']);
      this.formInitailValue = JSON.stringify(this.updateProfileForm.value);

      const subscription = this.updateProfileForm.valueChanges.subscribe(() => {
        const currentValue = JSON.stringify(this.updateProfileForm.value);
        this._hasUnSavedChangesSource.next(
          this.formInitailValue !== currentValue,
        );
      });
      this.subscriptions.push(subscription);
    }
  }
  private updateProfileFormInit() {
    this.updateProfileForm = new FormGroup({
      name: new FormControl(this.profile.name, [Validators.required]),
      email: new FormControl(this.profile.email, [
        Validators.required,
        Validators.email,
      ]),
      address: new FormControl(this.profile.address, [Validators.required]),
      city: new FormControl(this.profile.city, [Validators.required]),
      country: new FormControl(this.profile.country, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]+$/),
      ]),
      phone: new FormControl(this.profile.phone, [
        Validators.required,
        Validators.pattern(
          /^(?:\+\d{1,3}\s?)?(?:\(\d{1,4}\)|\d{1,4})(?:[-.\s]?\d{1,12})+$/,
        ),
      ]),
      departmentID: new FormControl(this.profile.departmentID, [
        Validators.required,
        notNullValidator(),
      ]),
      departmentName: new FormControl(this.profile.departmentName),
      employeeType: new FormControl(this.profile.employeeType, [
        Validators.required,
      ]),
    });
    // this.formInitailValue = JSON.stringify(this.profile);
  }
  public edit() {
    if (!this.updatingProfile) {
      this.updatingProfile = true;
      this.toggleForm();
    }
  }
  public reset() {
    this.updateProfileForm.patchValue(this.profile);
    this.formInitailValue = JSON.stringify(this.updateProfileForm.value);
  }

  private getDepartments() {
    const subscription = this.departmentService
      .getDepartments()
      .subscribe((res) => {
        this.departments = res.map(
          (d) => new Department(d.id, d.departmentName, d.employeesCount),
        );
      });
    this.subscriptions.push(subscription);
  }
  public onSubmit() {
    this.markAsTouchedAndDirty();
    const { address, country, phone, city } = this.updateProfileForm.value;
    const data: IEmployee = {
      ...this.profile,
      address,
      city,
      country,
      phone,
    };

    if (this.updateProfileForm.valid) {
      this.isSubmitLoading = true;
      const subscription = this.authService
        .updateProfile(this.profile.id, data)
        .subscribe({
          next: () => {
            this._hasUnSavedChangesSource.next(false);
            this.reloadComponent();
          },
          error: (e) => {
            console.log(e);
          },
          complete: () => {
            this.isSubmitLoading = false;
          },
        });
      this.subscriptions.push(subscription);
    }
  }
  private reloadComponent() {
    const currentUrl = this.router.url;
    this.router
      .navigateByUrl('/reload', { skipLocationChange: true })
      .then(() => {
        this.router.navigate([currentUrl]);
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
    return this.updateProfileForm.get(propertyName)!;
  }
  private markAsTouchedAndDirty() {
    Object.values(this.updateProfileForm.controls).forEach((control) => {
      if (!control.disabled) {
        control.markAsTouched();
        control.markAsDirty();
      }
    });
  }
  public canDeactivate() {
    const ref = this.modalService.open(SaveChangesModalComponent);
    return ref.closed;
  }
  public cancel() {
    this.toggleForm();

    this._hasUnSavedChangesSource.next(false);
  }
  public onClickEnter() {
    if (this.updatingProfile) {
      this.onSubmit();
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
