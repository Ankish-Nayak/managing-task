import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Todo } from '../../../shared/models/todo.model';
import { EmployeeService } from '../../../shared/services/employee/employee.service';
import { TodoService } from '../../../shared/services/todo/todo.service';
import { END_POINTS } from '../../../utils/constants';
import { ConfirmationModalComponent } from '../../../shared/modals/confirmation-modal/confirmation-modal.component';
import { ShareConfig, first } from 'rxjs';
import { ConfirmationService } from '../../../shared/services/dialog/confirmation.service';
import { TodoComponent } from './todo/todo.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ConfirmationModalComponent,
    TodoComponent,
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading: boolean = true;
  todoForm!: FormGroup;
  todos!: Todo[];
  deleteTodoEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  confirmation: boolean = false;
  constructor(
    private todoService: TodoService,
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private dialogConfirmationService: ConfirmationService,
  ) {}
  ngOnInit(): void {
    this.getTodos();
    this.todoFormInit();
    // this.dialogConfirmationService.confirmationSource$.subscribe((res) => {
    //   if(res !== null){
    //     this.confirmation = res;
    //   }
    // })
  }
  todoFormInit() {
    this.todoForm = new FormGroup({
      title: new FormControl(''),
      description: new FormControl(''),
      employeeId: new FormControl(''),
    });
  }
  ngAfterViewInit(): void {}
  getTodos() {
    this.isLoading = true;
    this.todoService.getTodos().subscribe(
      (res) => {
        console.log(res);
        this.todos = res;
        this.isLoading = false;
      },
      (e) => {
        this.isLoading = false;
        console.log(e);
      },
    );
  }
  //TODO: make request to show employee name rather than id.
  getEmployee(id: number) {
    this.employeeService.getEmployee(id).subscribe((res) => {
      console.log(res);
    });
  }
  updateTodo(id: number) {
    const todo = this.todos.find((todo) => todo.id === id);
    localStorage.setItem(`todo/${id}`, JSON.stringify(todo));
    this.router.navigate([`../update-todo/${id}`], { relativeTo: this.route });
  }
  deleteTodo(id: number) {
    // if(this.confirmation){
    //
    // }
    this.dialogConfirmationService.confirmationSource$.subscribe((res) => {
      if (res !== null) {
        console.log(`${res}: deleting ${id}`);
      }
    });
    // this.deleteTodoEvent.subscribe(
    //   (confirmation) => {
    //     console.log(`deleting ${id}`);
    //     if (confirmation) {
    //       // this.todoService.deleteTodo(id).subscribe((res) => {
    //       //   this.getTodos();
    //       //   console.log(res);
    //       // });
    //     }
    //   },
    //   (e) => {
    //     console.log(e);
    //   },
    //   () => {
    //     console.log('unsubscribe');
    //   },
    // );
  }
  confirm(confirmation: boolean) {
    // this.deleteTodoEvent.emit(confirmation);
  }
  assignTo() {
    this.router.navigate([`../${END_POINTS.createTodo}`], {
      relativeTo: this.route,
    });
  }
  getDescription(description: string) {
    return description.length > 115
      ? description.substring(0, 115) + '...'
      : description;
  }

  getModalName(id: number) {
    return `#deleteTodo|${id}`;
  }
  ngOnDestroy(): void {
    if (this.deleteTodoEvent) {
      this.deleteTodoEvent.unsubscribe();

      console.log('destoring');
    }
  }
}
