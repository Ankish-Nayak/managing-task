import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
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
import { Observable, debounceTime, fromEvent, merge } from 'rxjs';
import { IDepartment } from '../../shared/interfaces/requests/department.interface';
import { DepartmentService } from '../../shared/services/department/department.service';
import { GenericValidators } from '../../shared/validators/generic-validator';

type IPropertyName = 'departmentName';
@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss',
})
export class DepartmentListComponent implements OnInit, AfterViewInit {
  isLoading: boolean = true;
  departments!: IDepartment[];
  departmentForm!: FormGroup;

  deleteDepartmentEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  displayFeedback: { [key in IPropertyName]?: string } = {};

  private validatioMessages!: { [key: string]: { [key: string]: string } };
  private genericValidator!: GenericValidators;

  constructor(private departmentService: DepartmentService) {
    this.validatioMessages = {
      departmentName: {
        required: 'Required.',
        pattern: 'Must contains only aplhabets.',
      },
    };

    this.genericValidator = new GenericValidators(this.validatioMessages);
  }
  ngOnInit(): void {
    this.getDepartments();
  }
  ngAfterViewInit(): void {
    this.departmentFormInit();

    const controlsBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'),
    );

    merge(this.departmentForm.valueChanges, ...controlsBlurs)
      .pipe(debounceTime(800))
      .subscribe(() => {
        this.displayFeedback = this.genericValidator.processMessages(
          this.departmentForm,
        );
      });
  }

  deleteDepartment(id: number) {
    //TODO: make backened request for deleting .
    //
    this.deleteDepartmentEvent.subscribe((res) => {
      console.log(res);
      if (res) {
        this.departmentService.deleteDepartment(id).subscribe((res) => {
          console.log(res);
          this.isLoading = true;
          this.getDepartments();
        });
      } else {
        console.log('cancelled');
      }
    });
  }

  confirm(confirmation: boolean) {
    this.deleteDepartmentEvent.emit(confirmation);
  }

  createDepartment() {
    console.log(this.departmentForm);
    const data = this.departmentForm.value;
    console.log(data);
    this.departmentService.createDepartment(data).subscribe((res) => {
      console.log(res);
      this.isLoading = true;
      this.departmentFormInit();
      this.getDepartments();
    });
  }

  departmentFormInit() {
    this.departmentForm = new FormGroup({
      departmentName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]+$/),
      ]),
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
    return this.departmentForm.get(propertyName)!;
  }

  updateDepartment(id: number) {}

  getDepartments() {
    this.departmentService.getDepartments().subscribe(
      (res) => {
        this.isLoading = false;
        this.departments = res;
        console.log(res);
      },
      (e) => {
        console.log(e);
        this.isLoading = false;
      },
    );
  }
}
