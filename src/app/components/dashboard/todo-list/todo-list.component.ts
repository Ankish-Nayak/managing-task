import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationModalComponent } from '../../../shared/modals/confirmation-modal/confirmation-modal.component';
import { Todo } from '../../../shared/models/todo.model';
import { EmployeeService } from '../../../shared/services/employee/employee.service';
import { TodoService } from '../../../shared/services/todo/todo.service';
import { END_POINTS } from '../../../utils/constants';
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
  todoIdTobeDeleted: null | number = null;
  constructor(
    private todoService: TodoService,
    private router: Router,
    private route: ActivatedRoute,
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
  getEmployee() {
    // this.employeeService.getEmployee(id).subscribe((res) => {
    //   console.log(res);
    // });
  }

  navigateTo(id: number) {
    this.router.navigate([`../todo-detail/${id}`], { relativeTo: this.route });
  }
  updateTodo(id: number) {
    this.router.navigate([`../update-todo/${id}`], { relativeTo: this.route });
  }
  deleteTodo(id: number) {
    this.todoIdTobeDeleted = id;
  }
  confirm(confirmation: boolean) {
    if (confirmation && this.todoIdTobeDeleted !== null) {
      this.todoService.deleteTodo(this.todoIdTobeDeleted).subscribe(() => {
        this.getTodos();
      });
    }
    this.todoIdTobeDeleted = null;
  }
  assignTo() {
    this.router.navigate([`../${END_POINTS.createTodo}`], {
      relativeTo: this.route,
    });
  }
  ngOnDestroy(): void {}
}
