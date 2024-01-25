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
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, debounceTime, fromEvent, merge } from 'rxjs';
import { TodoService } from '../../../shared/services/todo/todo.service';
import { GenericValidators } from '../../../shared/validators/generic-validator';

type IPropertyName = 'title' | 'description' | 'employeeId';

@Component({
  selector: 'app-upsert-todo',
  standalone: true,
  imports: [ReactiveFormsModule],
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

  updateForm: boolean = false;

  private validatioMessages!: { [key: string]: { [key: string]: string } };
  private genericValidator!: GenericValidators;

  constructor(
    private todoService: TodoService,
    private router: Router,
    private route: ActivatedRoute,
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
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.id = id;
      }
    });

    this.todoFormInit();
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
        console.log(data);
        this.isLoading = true;

        this.todoService.updateTodo(Number(this.id), data).subscribe(
          (res) => {
            this.router.navigate(['../../todos'], { relativeTo: this.route });
            this.isLoading = false;
            console.log(res);
          },
          (e) => {
            this.isLoading = false;
            console.log(e);
          },
        );
      }
    } else {
      const { title, description, employeeId } = this.todoForm.value;
      this.markAsTouchedAndDirty();
      if (this.todoForm.valid) {
        const data = {
          title: this.trimValue(title),
          description: this.trimValue(description),
          isCompleted: false,
        };
        console.log(data);
        this.isLoading = true;
        this.todoService.createTodo(employeeId, data).subscribe(
          (res) => {
            this.router.navigate(['../todos'], { relativeTo: this.route });
            this.isLoading = false;
            console.log(res);
          },
          (e) => {
            this.isLoading = false;
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
    // will get this when we use it as update form
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
      employeeId: new FormControl('1', [Validators.required]),
    });
    // if(this.updateForm){
    //   const todo = this.todoService.getTodo(this.id);
    // this.todoForm = new FormGroup({
    //   title: new FormControl('', [
    //     Validators.required,
    //     Validators.minLength(6),
    //   ]),
    //   description: new FormControl('', [
    //     Validators.required,
    //     Validators.minLength(6),
    //   ]),
    //   employeeId: new FormControl('1', [Validators.required]),
    // });
    // }else{
    //
    // this.todoForm = new FormGroup({
    //   title: new FormControl('', [
    //     Validators.required,
    //     Validators.minLength(6),
    //   ]),
    //   description: new FormControl('', [
    //     Validators.required,
    //     Validators.minLength(6),
    //   ]),
    //   employeeId: new FormControl('1', [Validators.required]),
    // });
    //
    // }
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