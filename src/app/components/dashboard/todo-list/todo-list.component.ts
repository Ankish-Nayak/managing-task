import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DoCheck,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableControlPanelComponent } from '../../../shared/controlPanels/data-table-control-panel/data-table-control-panel.component';
import { TEmployee } from '../../../shared/interfaces/employee.type';
import { GetEmployeesQueryParams } from '../../../shared/interfaces/requests/employee.interface';
import { ITask } from '../../../shared/interfaces/requests/toto.interface';
import { ConfirmationModalComponent } from '../../../shared/modals/confirmation-modal/confirmation-modal.component';
import { UpsertContentModalComponent } from '../../../shared/modals/upsert-content-modal/upsert-content-modal.component';
import { Todo } from '../../../shared/models/todo.model';
import { PaginationComponent } from '../../../shared/paginations/pagination/pagination.component';
import { UserViewColsPipe } from '../../../shared/pipes/user-view-cols/user-view-cols.pipe';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { EmployeeService } from '../../../shared/services/employee/employee.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { TodoService } from '../../../shared/services/todo/todo.service';
import { SpinnerComponent } from '../../../shared/spinners/spinner/spinner.component';
import {
  COMPONENT_NAME,
  GET_TODOS_KEY,
  UserRole,
} from '../../../utils/constants';
import { sortTasksByProperty } from '../../../utils/sortTasksByPropery';
import { COLS, TCOLS } from './cols';
import { TodoListHeaderComponent } from './todo-list-header/todo-list-header.component';
import { TodoComponent } from './todo/todo.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ConfirmationModalComponent,
    TodoComponent,
    TodoListHeaderComponent,
    UserViewColsPipe,
    SpinnerComponent,
    UpsertContentModalComponent,
    PaginationComponent,
    DataTableControlPanelComponent,
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent
  implements OnInit, AfterViewInit, OnDestroy, DoCheck
{
  isLoading: boolean = true;
  todoForm!: FormGroup;
  todos!: Todo[];
  todoIdTobeDeleted: null | number = null;
  userType!: TEmployee;
  cols: TCOLS = COLS;
  UserRole = UserRole;
  pageState = new GetEmployeesQueryParams(
    (() => {
      const data = localStorage.getItem(GET_TODOS_KEY);
      if (data) {
        return JSON.parse(data);
      } else {
        return {
          isPagination: true,
          index: 0,
          take: 10,
        };
      }
    })(),
  );
  columnSortBy: { name: keyof ITask | null; dsc: boolean } = {
    name: null,
    dsc: false,
  };
  searchByCols: { name: keyof Todo }[] = [
    { name: 'title' },
    { name: 'description' },
  ];
  totalPagesCount: number = 0;
  constructor(
    private todoService: TodoService,
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
  ngDoCheck(): void {
    console.log('changed');
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
    this.todoService.getTodos(this.pageState).subscribe(
      (res) => {
        this.todos = res.iterableData;
        this.totalPagesCount = res.totalPageCount;
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
    const ref = this.modalService.open(UpsertContentModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });
    ref.componentInstance.id = id;
    ref.componentInstance.update = true;
    ref.componentInstance.componentName = COMPONENT_NAME.TODO_DETAIL_COMPONENT;
    ref.closed.subscribe((res) => {
      console.log(res);
      this.getTodos();
    });
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
        const ref = this.modalService.open(UpsertContentModalComponent, {
          size: 'lg',
          backdrop: 'static',
        });
        ref.componentInstance.update = false;
        ref.componentInstance.componentName =
          COMPONENT_NAME.UPSERT_TODO_COMPONENT;
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
  onClickedHeader(name: keyof Todo) {
    if (this.columnSortBy.name === name) {
      this.columnSortBy.dsc = !this.columnSortBy.dsc;
    } else {
      this.columnSortBy.name = name;
      this.columnSortBy.dsc = false;
    }
    this.todoService.getTodos(this.pageState).subscribe((res) => {
      this.todos = sortTasksByProperty(
        res.iterableData,
        name,
        this.columnSortBy.dsc,
      );
      this.totalPagesCount = res.totalPageCount;
    });
  }
  onPageChange(pageStateUpdates: Partial<GetEmployeesQueryParams>) {
    if (pageStateUpdates.take) {
      this.pageState.index = 0;
    }
    this.pageState = {
      ...this.pageState,
      ...pageStateUpdates,
    };
    localStorage.setItem(GET_TODOS_KEY, JSON.stringify(this.pageState));
    this.todoService.getTodos(this.pageState).subscribe((res) => {
      this.todos = res.iterableData;
      this.totalPagesCount = res.totalPageCount;
    });
    this.getTodos;
  }
  allowedToView(allowedUsers: TEmployee[]) {
    console.log('changed');

    return allowedUsers.includes(this.userType);
  }
  ngOnDestroy(): void {
    localStorage.removeItem(GET_TODOS_KEY);
  }
}
