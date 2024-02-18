import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
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
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, debounceTime, fromEvent, merge } from 'rxjs';
import { SpinnerComponent } from '../../../shared/components/spinners/spinner/spinner.component';
import { SubmitSpinnerComponent } from '../../../shared/components/spinners/submit-spinner/submit-spinner.component';
import { ClickedEnterDirective } from '../../../shared/directives/clicked-enter/clicked-enter.directive';
import {
  ICreateTodoPostData,
  IUpdateTodoPostData,
} from '../../../shared/interfaces/requests/toto.interface';
import {
  Employee,
  EmployeeAdapter,
} from '../../../shared/models/employee.model';
import { Todo } from '../../../shared/models/todo.model';
import { EmployeeService } from '../../../shared/services/employee/employee.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { TodoService } from '../../../shared/services/todo/todo.service';
import { GenericValidators } from '../../../shared/validators/generic-validator';
import { notNullValidator } from '../../../shared/validators/not-null-validators';
import { END_POINTS, Months } from '../../../utils/constants';
import { getSpiltTimeISO } from '../../../utils/time';

type IPropertyName =
  | 'title'
  | 'description'
  | 'employeeId'
  | 'day'
  | 'year'
  | 'month'
  | 'deadlineDate'
  | 'deadlineTime';

@Component({
  selector: 'app-upsert-todo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SpinnerComponent,
    ClickedEnterDirective,
    SubmitSpinnerComponent,
  ],
  templateUrl: './upsert-todo.component.html',
  styleUrl: './upsert-todo.component.scss',
})
export class UpsertTodoComponent {
  public isLoading: boolean = true;
  public isSubmitLoading: boolean = false;
  todoForm!: FormGroup;
  public displayFeedback: { [key in IPropertyName]?: string } = {};
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
  @Input() id!: string;
  @Input() displayTitle: boolean = true;

  public employees!: Employee[];
  readonly Months = Months;

  private employeeId: number | null = null;
  @Input({ required: true }) updateForm!: boolean;
  @Output() updated: EventEmitter<boolean> = new EventEmitter<boolean>();
  private validatioMessages!: { [key: string]: { [key: string]: string } };
  private genericValidator!: GenericValidators;

  constructor(
    private todoService: TodoService,
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private employeeAdapter: EmployeeAdapter,
    private datePipe: DatePipe,
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
      date: {
        required: 'Required',
        pattern: 'InValid date format',
      },
      deadlineDate: {
        required: 'Required',
        notNull: 'Select deadline Date',
      },
      deadlineTime: {
        required: 'Required',
        notNull: 'Select deadline Time',
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
  private getEmployees() {
    this.employeeService.getEmployees({}).subscribe((res) => {
      this.employees = this.employeeAdapter.adaptArray(res.iterableData);
      if (this.employeeId !== null) {
        this.employees = this.employees.filter(
          (employee) => employee.id === this.employeeId,
        );
      }
      this.isLoading = false;
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.id = id;
      }
    });

    this.getEmployees();
    this.todoFormInit();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('employeeId');
      if (id !== null) {
        this.todoForm.patchValue({ employeeId: id });
        this.employeeId = Number(id);
        this.todoForm.get('employeeId')?.disable();
      }
    });
  }
  public onSubmit() {
    if (this.updateForm) {
      const { title, description, deadlineDate, deadlineTime } =
        this.todoForm.value;
      this.markAsTouchedAndDirty();
      if (this.todoForm.valid) {
        this.isSubmitLoading = true;
        const data: IUpdateTodoPostData = {
          title: this.trimValue(title),
          description: this.trimValue(description),
          isCompleted: false,
          employeeId: Number(this.id),
          deadLine:
            this.datePipe.transform(
              `${deadlineDate}T${deadlineTime}:00`,
              'yyyy-MM-ddTHH:mm:ss.SSS',
            ) + 'Z',
        };

        this.todoService.updateTodo(data.employeeId, data).subscribe({
          next: () => {
            this.updated.emit(true);
            this.toastService.show(
              'Todo',
              'Todo has been updated successfully',
              'success',
              2000,
            );
          },
          error: (e) => {
            // this.isLoading = false;
            console.log(e);
            this.toastService.show(
              'Todo',
              'Failed to update todo',
              'error',
              2000,
            );
          },
          complete: () => {
            this.isSubmitLoading = false;
          },
        });
      }
    } else {
      const { title, description, employeeId, deadlineDate, deadlineTime } =
        this.todoForm.value;
      const data: ICreateTodoPostData = {
        title: this.trimValue(title),
        description: this.trimValue(description),
        employeeId,
        isCompleted: false,

        deadLine:
          this.datePipe.transform(
            `${deadlineDate}T${deadlineTime}:00`,
            'yyyy-MM-ddTHH:mm:ss.SSS',
          ) + 'Z',
      };
      if (this.employeeId) {
        data.employeeId = this.employeeId;
      }

      this.markAsTouchedAndDirty();
      if (this.todoForm.valid) {
        this.isSubmitLoading = true;
        // this.isLoading = true;
        this.todoService.createTodo(data).subscribe({
          next: () => {
            if (this.employeeId) {
              this.router.navigate([`../../${END_POINTS.employeeList}`], {
                relativeTo: this.route,
              });
            }
            this.updated.emit(true);
            this.toastService.show(
              'Todo',
              'Todo has been created',
              'success',
              2000,
            );
          },
          error: (e) => {
            this.toastService.show(
              'Todo',
              'Failed to create todo',
              'error',
              2000,
            );
            console.log(e);
          },
          complete: () => {
            this.isSubmitLoading = false;
          },
        });
      }
    }
  }
  private trimValue(value: any) {
    return value.trim();
  }
  private todoFormInit() {
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
      deadlineDate: new FormControl('null', [
        Validators.required,
        notNullValidator(),
      ]),
      deadlineTime: new FormControl('null', [
        Validators.required,
        notNullValidator(),
      ]),
    });
    if (this.updateForm) {
      const todo: Todo = JSON.parse(this.todoService.getTodo(this.id));
      const { dateInput, timeInput } = getSpiltTimeISO(todo.deadLine);
      this.todoForm.patchValue({
        title: todo.title || '',
        description: todo.description || '',
        employeeId: String(todo.employeeId),
        deadlineDate: dateInput,
        deadlineTime: timeInput,
      });
    }
  }

  public reset() {
    if (this.updateForm) this.todoFormInit();
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
    return this.todoForm.get(propertyName)!;
  }
  private markAsTouchedAndDirty() {
    Object.values(this.todoForm.controls).forEach((control) => {
      if (!control.disabled) {
        control.markAsTouched();
        control.markAsDirty();
      }
    });
  }
  onClickedEnter() {
    this.onSubmit();
  }
}
