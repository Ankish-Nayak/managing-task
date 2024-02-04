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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  BehaviorSubject,
  Observable,
  debounceTime,
  fromEvent,
  merge,
} from 'rxjs';
import { BlockNavigationIfChange } from '../../../shared/interfaces/hasChanges/BlockNavigationIfChange';
import { IEmployee } from '../../../shared/interfaces/requests/employee.interface';
import { ConfirmationModalComponent } from '../../../shared/modals/confirmation-modal/confirmation-modal.component';
import { SaveChangesModalComponent } from '../../../shared/modals/save-changes-modal/save-changes-modal.component';
import { Department } from '../../../shared/models/department.model';
import { Employee } from '../../../shared/models/employee.model';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { GenericValidators } from '../../../shared/validators/generic-validator';
import { notNullValidator } from '../../../shared/validators/not-null-validators';
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
  selector: 'app-upsert-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmationModalComponent],
  templateUrl: './upsert-profile.component.html',
  styleUrl: './upsert-profile.component.scss',
})
export class UpsertProfileComponent
  implements OnInit, AfterViewInit, BlockNavigationIfChange
{
  isLoading: boolean = false;
  profile: Employee = new Employee(0, '', '', 0, '', '', '', '', 0, '', '', '');
  profileForm!: FormGroup;
  // returns the query list of FormControlName
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
  private formInitialValue: any;
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
    private modalService: NgbModal,
  ) {
    // defining validation messages here.
    this.validatioMessages = UPDATE_PROFILE_VALIDAION_MESSAGES;
    this.genericValidator = new GenericValidators(this.validatioMessages);
  }
  ngOnInit(): void {
    this.profileFormInit();
  }

  ngAfterViewInit(): void {
    // blur events.
    const controlsBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'),
    );
    this.profileForm.valueChanges.subscribe(() => {
      const currentValue = JSON.stringify(this.profileForm.value);
      console.log(
        JSON.stringify(this.profile),
        JSON.stringify(this.profileForm.value),
      );
      console.log('same', this.formInitialValue === currentValue);
      this._hasUnSavedChangesSource.next(
        this.formInitialValue !== currentValue,
      );
    });

    merge(this.profileForm.valueChanges, ...controlsBlurs)
      .pipe(debounceTime(800))
      .subscribe(() => {
        this.displayFeedback = this.genericValidator.processMessages(
          this.profileForm,
        );
      });
  }
  disabling(propertyName: IPropertyName) {
    this.profileForm.get(propertyName)?.disable();
  }
  profileFormInit() {
    console.log(this.profile);
    this.profileForm = new FormGroup({
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
    this.formInitialValue = JSON.stringify(this.profileForm.value);
  }
  save() {
    this._hasUnSavedChangesSource.next(false);
  }
  onSubmit(e: SubmitEvent) {
    e.preventDefault();
    // Mark all form as touched to trigger validation messages
    this.markAsTouchedAndDirty();
    const {
      name,
      email,
      address,
      country,
      phone,
      departmentID,
      city,
      employeeType,
      departmentName,
    } = this.profileForm.value;
    const data: IEmployee = {
      name,
      address,
      country,
      phone,
      departmentID,
      departmentName,
      city,
      employeeType,
      email,
      createdAt: '', // incapability of backend develper
      updatedAt: '', // incapability of backend develper
      id: this.profile.id,
    };

    if (this.profileForm.valid) {
      console.log('inputs: ', data);
      this.authService.updateProfile(this.profile.id, data).subscribe((res) => {
        this._hasUnSavedChangesSource.next(false);
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
    return this.profileForm.get(propertyName)!;
  }
  markAsTouchedAndDirty() {
    Object.values(this.profileForm.controls).forEach((control) => {
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
}
