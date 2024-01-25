import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Todo } from '../../../shared/models/todo.model';
import { EmployeeService } from '../../../shared/services/employee/employee.service';
import { TodoService } from '../../../shared/services/todo/todo.service';
import { END_POINTS } from '../../../utils/constants';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent implements OnInit, AfterViewInit {
  isLoading: boolean = true;
  todoForm!: FormGroup;
  todos!: Todo[];
  deleteTodoEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private todoService: TodoService,
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
  ) {}
  ngOnInit(): void {
    this.getTodos();
    this.todoFormInit();
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
    this.deleteTodoEvent.subscribe((res) => {
      if (res) {
        this.todoService.deleteTodo(id).subscribe((res) => {
          this.getTodos();
          console.log(res);
        });
      }
    });
  }
  confirm(confirmation: boolean) {
    this.deleteTodoEvent.emit(confirmation);
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
}
