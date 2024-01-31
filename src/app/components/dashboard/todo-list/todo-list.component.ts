import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TEmployee } from '../../../shared/interfaces/employee.type';
import { ConfirmationModalComponent } from '../../../shared/modals/confirmation-modal/confirmation-modal.component';
import { UpsertContentModalComponent } from '../../../shared/modals/upsert-content-modal/upsert-content-modal.component';
import { Todo } from '../../../shared/models/todo.model';
import { UserViewColsPipe } from '../../../shared/pipes/user-view-cols/user-view-cols.pipe';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { EmployeeService } from '../../../shared/services/employee/employee.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { TodoService } from '../../../shared/services/todo/todo.service';
import { SpinnerComponent } from '../../../shared/spinners/spinner/spinner.component';
import { COMPONENT_NAME, USER_ROLES } from '../../../utils/constants';
import { COLS, TCOLS } from './cols';
import { TodoComponent } from './todo/todo.component';
import { UpsertTodoModalComponent } from './upsert-todo-modal/upsert-todo-modal.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ConfirmationModalComponent,
    TodoComponent,
    UserViewColsPipe,
    SpinnerComponent,
    UpsertTodoModalComponent,
    UpsertContentModalComponent,
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading: boolean = true;
  todoForm!: FormGroup;
  todos!: Todo[];
  todoIdTobeDeleted: null | number = null;
  userType!: TEmployee;
  cols: TCOLS = COLS;
  USER_ROLES = USER_ROLES;
  constructor(
    private todoService: TodoService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private modalService: NgbModal,
  ) {}
  ngOnInit(): void {
    this.getTodos();
    this.todoFormInit();
    this.getUserType();
  }
  getUserType() {
    this.authService.userTypeMessage$.subscribe((res) => {
      if (res !== null) {
        this.userType = res;
      }
    });
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
    this.todoService.getTodos({}).subscribe(
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
    const ref = this.modalService.open(UpsertContentModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });
    ref.componentInstance.update = true;
    ref.componentInstance.id = id;
    ref.componentInstance.componentName = COMPONENT_NAME.UPSERT_TODO_COMPONENT;
    ref.closed.subscribe((res) => {
      console.log(res);
      this.getTodos();
    });
    ref.dismissed.subscribe((res) => {
      console.log(res);
      this.toastService.show(
        'Task Updation',
        'Task updation was cancelled',
        'info',
      );
    });
  }
  deleteTodo(id: number) {
    this.todoIdTobeDeleted = id;
  }
  confirm(confirmation: boolean) {
    if (confirmation && this.todoIdTobeDeleted !== null) {
      this.todoService.deleteTodo(this.todoIdTobeDeleted).subscribe(() => {
        this.toastService.show(
          'Todo Deletion',
          'Todo was deleted',
          'success',
          2000,
        );
        this.getTodos();
      });
    }
    this.todoIdTobeDeleted = null;
  }
  canAssignTask() {
    this.employeeService.getEmployees({}).subscribe((res) => {
      if (res.iterableData.length === 0) {
        this.toastService.show(
          'Can Assign Task',
          'No employee in department to assign task',
          'error',
          5000,
        );
      } else {
        const ref = this.modalService.open(UpsertTodoModalComponent, {
          size: 'lg',
          backdrop: 'static',
        });
        ref.componentInstance.update = false;
        ref.closed.subscribe((res) => {
          console.log(res);
          this.getTodos();
        });
        ref.dismissed.subscribe((res) => {
          console.log(res);
          this.toastService.show(
            'Assign Task',
            'Task assignment was cancelled',
            'info',
          );
        });
      }
    });
  }
  assignTo() {
    this.canAssignTask();
  }

  allowedToView(allowedUsers: TEmployee[]) {
    return allowedUsers.includes(this.userType);
  }
  ngOnDestroy(): void {}
}
