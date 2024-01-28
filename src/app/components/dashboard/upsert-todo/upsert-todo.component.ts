import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChildren } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormControlName,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, debounceTime, fromEvent, merge } from 'rxjs';
import { Employee } from '../../../shared/models/employee.model';
import { EmployeeService } from '../../../shared/services/employee/employee.service';
import { TodoService } from '../../../shared/services/todo/todo.service';
import { GenericValidators } from '../../../shared/validators/generic-validator';
import { notNullValidator } from '../../../shared/validators/not-null-validators';
import { END_POINTS } from '../../../utils/constants';
import { ToastService } from '../../../shared/services/toast/toast.service';

type IPropertyName = 'title' | 'description' | 'employeeId';

@Component({
  selector: 'app-upsert-todo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './upsert-todo.component.html',
  styleUrl: './upsert-todo.component.scss',
})
export class UpsertTodoComponent {
  isLoading: boolean = false;
  todoForm!: FormGroup;
  displayFeedback: { [key in IPropertyName]?: string } = {};
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
  id!: string;

  employees!: Employee[];

  updateForm: boolean = false;

  private validatioMessages!: { [key: string]: { [key: string]: string } };
  private genericValidator!: GenericValidators;

  constructor(
    private todoService: TodoService,
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private toastService: ToastService,
  ) {
    this.validatioMessages = {
      title: {
        required: 'Required',
        minlength: 'Must be of aleast 6 chars.',
      },
      description: {
        required: 'Required',
        minlength: 'Must be of aleast 6 chars.',
      },
      employeeId: {
        required: 'Required',
        notNull: 'Select Employee',
      },
    };
    this.genericValidator = new GenericValidators(this.validatioMessages);
  }
  ngAfterViewInit(): void {
    // blur events.
    const controlsBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'),
    );

    merge(this.todoForm.valueChanges, ...controlsBlurs)
      .pipe(debounceTime(800))
      .subscribe(() => {
        this.displayFeedback = this.genericValidator.processMessages(
          this.todoForm,
        );
      });
  }
  getEmployees() {
    this.employeeService.getEmployees(1).subscribe((res) => {
      this.employees = res.iterableData.map((item) => {
        return new Employee(
          item.id,
          item.name,
          item.email,
          item.employeeType,
          item.address,
          item.city,
          item.country,
          item.phone,
          item.departmentID,
          item.departmentName,
        );
      });
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.id = id;
      }
    });
    if (this.getActiveEndpoint() === `./${END_POINTS.createTodo}`) {
      this.updateForm = false;
    } else {
      this.updateForm = true;
    }
    this.getEmployees();
    this.todoFormInit();
  }

  getActiveEndpoint() {
    // Get the current activated route
    let currentRoute = this.route;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    // Get the URL segments of the activated route
    const urlSegments = currentRoute.snapshot.url.map(
      (segment) => segment.path,
    );

    // Determine the active endpoint based on the URL segments
    const activeEndpoint = '/' + urlSegments.join('/');
    return `.${activeEndpoint}`;
  }

  onSubmit(e: SubmitEvent) {
    e.preventDefault();
    // const trimmedData = Object.values(this.todoForm.value).forEach((value))
    //
    if (this.updateForm) {
      const { title, description } = this.todoForm.value;
      this.markAsTouchedAndDirty();
      if (this.todoForm.valid) {
        const data = {
          title: this.trimValue(title),
          description: this.trimValue(description),
          isCompleted: false,
        };
        this.isLoading = true;

        this.todoService.updateTodo(Number(this.id), data).subscribe(
          () => {
            this.router.navigate(['../../todos'], { relativeTo: this.route });
            this.isLoading = false;
            this.toastService.show(
              'Todo',
              'Todo has been updated successfully',
              'success',
              2000,
            );
          },
          (e) => {
            this.isLoading = false;
            console.log(e);
            this.toastService.show(
              'Todo',
              'Failed to update todo',
              'error',
              2000,
            );
          },
        );
      }
    } else {
      const { title, description, employeeId } = this.todoForm.value;
      const data = {
        title: this.trimValue(title),
        description: this.trimValue(description),
        employeeId,
        isCompleted: false,
      };

      this.markAsTouchedAndDirty();
      if (this.todoForm.valid) {
        this.isLoading = true;
        this.todoService.createTodo(employeeId, data).subscribe(
          () => {
            this.router.navigate(['../todos'], { relativeTo: this.route });
            this.toastService.show(
              'Todo',
              'Todo has been created',
              'success',
              2000,
            );
            this.isLoading = false;
          },
          (e) => {
            this.isLoading = false;

            this.toastService.show(
              'Todo',
              'Failed to create todo',
              'error',
              2000,
            );
            console.log(e);
          },
        );
      }
    }
  }
  trimValue(value: any) {
    return value.trim();
  }
  todoFormInit() {
    if (this.updateForm) {
      const todo = JSON.parse(this.todoService.getTodo(this.id));
      this.todoForm = new FormGroup({
        title: new FormControl(todo.title || '', [
          Validators.required,
          Validators.minLength(6),
        ]),
        description: new FormControl(todo.description || '', [
          Validators.required,
          Validators.minLength(6),
        ]),
        employeeId: new FormControl(String(todo.employeeId), [
          Validators.required,
          notNullValidator(),
        ]),
      });
    } else {
      this.todoForm = new FormGroup({
        title: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        description: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        employeeId: new FormControl('null', [
          Validators.required,
          notNullValidator(),
        ]),
      });
    }
  }

  reset() {
    if (this.updateForm) this.todoFormInit();
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
    return this.todoForm.get(propertyName)!;
  }
  markAsTouchedAndDirty() {
    Object.values(this.todoForm.controls).forEach((control) => {
      if (!control.disabled) {
        control.markAsTouched();
        control.markAsDirty();
      }
    });
  }
}
