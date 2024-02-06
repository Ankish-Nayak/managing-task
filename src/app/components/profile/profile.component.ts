import { CommonModule, JsonPipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
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
  debounceTime,
  fromEvent,
  merge,
} from 'rxjs';
import { ClickedEnterDirective } from '../../shared/directives/clicked-enter/clicked-enter.directive';
import { BlockNavigationIfChange } from '../../shared/interfaces/hasChanges/BlockNavigationIfChange';
import { IEmployee } from '../../shared/interfaces/requests/employee.interface';
import { SaveChangesModalComponent } from '../../shared/modals/save-changes-modal/save-changes-modal.component';
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
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, BlockNavigationIfChange {
  isLoading: boolean = true;
  profile: Employee = new Employee(0, '', '', 0, '', '', '', '', 0, '', '', '');
  updateProfileForm!: FormGroup;
  // returns the query list of FormControlName
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  formInitailValue!: string;

  private _hasUnSavedChangesSource = new BehaviorSubject<boolean>(false);

  hasUnSavedChanges$: Observable<boolean> =
    this._hasUnSavedChangesSource.asObservable();

  displayFeedback: { [key in IPropertyName]?: string } = {};
  employees: { name: string; value: number }[] = [
    { name: 'Employee', value: 0 },
    { name: 'Admin', value: 1 },
  ];

  cardBodyHeader: string[] = ['card-body-header'];

  departments!: Department[];

  updatingProfile: boolean = false;

  private validatioMessages!: { [key: string]: { [key: string]: string } };
  private genericValidator!: GenericValidators;

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
  profileComponentInit() {
    this.isLoading = true;
    this.getDepartments();

    this.updateProfileFormInit();
    this.getProfile();
    this.toggleForm();
  }

  getProfile() {
    this.authService.profile().subscribe((res) => {
      this.profile = res;
      this.updateProfileForm.patchValue(this.profile);
      // this.formInitailValue = JSON.stringify(res);
      this.isLoading = false;
    });
  }

  ngAfterViewInit(): void {
    // blur events.
    const controlsBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'),
    );

    merge(this.updateProfileForm.valueChanges, ...controlsBlurs)
      .pipe(debounceTime(800))
      .subscribe(() => {
        this.displayFeedback = this.genericValidator.processMessages(
          this.updateProfileForm,
        );
      });
  }
  disabling(propertyName: IPropertyName) {
    this.updateProfileForm.get(propertyName)?.disable();
  }
  enableAllowedField(fields: IPropertyName[]) {
    fields.forEach((field) => {
      if (this.updateProfileForm.get(field)?.disabled) {
        this.updateProfileForm.get(field)?.enable();
      }
    });
  }
  toggleForm() {
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

      this.updateProfileForm.valueChanges.subscribe(() => {
        const currentValue = JSON.stringify(this.updateProfileForm.value);
        this._hasUnSavedChangesSource.next(
          this.formInitailValue !== currentValue,
        );
      });
      // this.updateProfileForm.enable();
    }
  }
  updateProfileFormInit() {
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
  edit() {
    if (!this.updatingProfile) {
      this.updatingProfile = true;
      this.toggleForm();
    }
  }
  reset() {
    this.updateProfileForm.patchValue(this.profile);
    this.formInitailValue = JSON.stringify(this.updateProfileForm.value);
  }

  getDepartments() {
    this.departmentService.getDepartments().subscribe((res) => {
      this.departments = res.map(
        (d) => new Department(d.id, d.departmentName, d.employeesCount),
      );
    });
  }
  onSubmit() {
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
      this.authService.updateProfile(this.profile.id, data).subscribe(() => {
        this._hasUnSavedChangesSource.next(false);
        this.reloadComponent();
      });
    }
  }
  reloadComponent() {
    const currentUrl = this.router.url;
    this.router
      .navigateByUrl('/reload', { skipLocationChange: true })
      .then(() => {
        this.router.navigate([currentUrl]);
      });
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
    return this.updateProfileForm.get(propertyName)!;
  }
  markAsTouchedAndDirty() {
    Object.values(this.updateProfileForm.controls).forEach((control) => {
      if (!control.disabled) {
        control.markAsTouched();
        control.markAsDirty();
      }
    });
  }

  canDeactivate() {
    const ref = this.modalService.open(SaveChangesModalComponent);
    return ref.closed;
  }
  cancel() {
    this.toggleForm();

    this._hasUnSavedChangesSource.next(false);
  }
  onClickEnter() {
    if (this.updatingProfile) {
      this.onSubmit();
    }
  }
}
