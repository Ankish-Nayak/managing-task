import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DoCheck,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableControlPanelComponent } from '../../../shared/components/controlPanels/data-table-control-panel/data-table-control-panel.component';
import { ConfirmationModalComponent } from '../../../shared/components/modals/confirmation-modal/confirmation-modal.component';
import { UpsertContentModalComponent } from '../../../shared/components/modals/upsert-content-modal/upsert-content-modal.component';
import { PaginationComponent } from '../../../shared/components/paginations/pagination/pagination.component';
import { SpinnerComponent } from '../../../shared/components/spinners/spinner/spinner.component';
import { TEmployee } from '../../../shared/interfaces/employee.type';
import { GetEmployeesQueryParams } from '../../../shared/interfaces/requests/employee.interface';
import {
  GetTodosQueryParams,
  ITask,
} from '../../../shared/interfaces/requests/toto.interface';
import { Todo } from '../../../shared/models/todo.model';
import { UserViewColsPipe } from '../../../shared/pipes/user-view-cols/user-view-cols.pipe';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { EmployeeService } from '../../../shared/services/employee/employee.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { TodoService } from '../../../shared/services/todo/todo.service';
import {
  COMPONENT_NAME,
  LocalStorageKeys,
  UserRole,
} from '../../../utils/constants';

import { Subscription } from 'rxjs';
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '../../../utils/localStorageCRUD';
import { COLS, TCOLS } from './cols';
import { TodoListHeaderComponent } from './todo-list-header/todo-list-header.component';
import { TodoComponent } from './todo/todo.component';

export enum TodoTab {
  All = 'All',
  Completed = 'Completed',
  Pending = 'Active',
}
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
  public isLoading: boolean = true;
  public todos!: Todo[];
  public userType!: UserRole;
  public cols: TCOLS = COLS;
  public UserRole = UserRole;
  public pageState = new GetTodosQueryParams(
    (() => {
      const data = getLocalStorageItem(LocalStorageKeys.GetTodos);
      if (data) {
        return JSON.parse(data);
      } else {
        return {
          isPagination: true,
          index: 0,
          take: 10,
          isCompleted: null,
        };
      }
    })(),
  );
  public todoTab: TodoTab = TodoTab.All;
  public columnSortBy: { name: keyof ITask | null; dsc: boolean } = {
    name: null,
    dsc: false,
  };
  public todosTabs: TodoTab[] = [
    TodoTab.All,
    TodoTab.Completed,
    TodoTab.Pending,
  ];
  public totalPagesCount: number = 0;
  private todoIdTobeDeleted: null | number = null;
  private subscriptions: Subscription[] = [];
  constructor(
    private todoService: TodoService,
    private authService: AuthService,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private modalService: NgbModal,
  ) {}
  ngOnInit(): void {
    this.getTodos();
    this.getUserType();
    this.todoTab = (() => {
      if (this.pageState.isCompleted === null) {
        return TodoTab.All;
      } else if (this.pageState.isCompleted) {
        return TodoTab.Completed;
      } else {
        return TodoTab.Pending;
      }
    })();
    this.processCols();
  }
  private getUserType() {
    const subscription = this.authService.userTypeMessage$.subscribe((res) => {
      if (res !== null) {
        this.userType = res;
      }
    });
    this.subscriptions.push(subscription);
  }
  ngDoCheck(): void {}
  ngAfterViewInit(): void {}
  private getTodos() {
    this.isLoading = true;
    const subscription = this.todoService.getTodos(this.pageState).subscribe({
      next: (res) => {
        this.todos = res.iterableData;
        this.totalPagesCount = res.totalPageCount;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
    this.subscriptions.push(subscription);
  }
  public navigateTo(id: number) {
    const ref = this.modalService.open(UpsertContentModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });
    ref.componentInstance.id = id;
    ref.componentInstance.update = true;
    ref.componentInstance.componentName = COMPONENT_NAME.TODO_DETAIL_COMPONENT;
    const subscription1 = ref.closed.subscribe(() => {
      this.getTodos();
    });
    this.subscriptions.push(subscription1);
  }
  public updateTodo(id: number) {
    const ref = this.modalService.open(UpsertContentModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });
    ref.componentInstance.update = true;
    ref.componentInstance.id = id;
    ref.componentInstance.componentName = COMPONENT_NAME.UPSERT_TODO_COMPONENT;
    const subscription1 = ref.closed.subscribe(() => {
      this.getTodos();
    });
    const subscription2 = ref.dismissed.subscribe(() => {
      this.toastService.show(
        'Task Updation',
        'Task updation was cancelled',
        'info',
      );
    });
    this.subscriptions.push(...[subscription2, subscription1]);
  }
  public deleteTodo(id: number) {
    this.todoIdTobeDeleted = id;
  }
  public confirm(confirmation: boolean) {
    if (confirmation && this.todoIdTobeDeleted !== null) {
      const subscription = this.todoService
        .deleteTodo(this.todoIdTobeDeleted)
        .subscribe(() => {
          this.toastService.show(
            'Todo Deletion',
            'Todo was deleted',
            'success',
            2000,
          );
          this.getTodos();
        });
      this.subscriptions.push(subscription);
    }
    this.todoIdTobeDeleted = null;
  }
  private canAssignTask() {
    const subscription1 = this.employeeService
      .getEmployees({})
      .subscribe((res) => {
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
          const subscription2 = ref.closed.subscribe(() => {
            this.getTodos();
          });
          const subscriptin3 = ref.dismissed.subscribe(() => {
            this.toastService.show(
              'Assign Task',
              'Task assignment was cancelled',
              'info',
            );
          });
          this.subscriptions.push(...[subscriptin3, subscription2]);
        }
      });
    this.subscriptions.push(subscription1);
  }
  public assignTo() {
    this.canAssignTask();
  }
  public onPageChange(pageStateUpdates: Partial<GetEmployeesQueryParams>) {
    if (pageStateUpdates.take) {
      this.pageState.index = 0;
    }
    this.pageState = {
      ...this.pageState,
      ...pageStateUpdates,
    };
    setLocalStorageItem(
      LocalStorageKeys.GetTodos,
      JSON.stringify(this.pageState),
    );
    const subscription = this.todoService
      .getTodos(this.pageState)
      .subscribe((res) => {
        this.todos = res.iterableData;
        this.totalPagesCount = res.totalPageCount;
        this.pageState.take = Math.min(this.pageState.take, res.totalPageCount);
      });
    this.subscriptions.push(subscription);
  }
  public allowedToView(allowedUsers: TEmployee[]) {
    return allowedUsers.includes(this.userType);
  }
  public handleTabChange(tab: TodoTab) {
    this.todoTab = tab;
    this.pageState = {
      ...this.pageState,
      isCompleted: (() => {
        if (this.todoTab === TodoTab.All) {
          return null;
        } else if (this.todoTab === TodoTab.Completed) {
          return true;
        } else {
          return false;
        }
      })(),
    };

    this.processCols();
    this.onPageChange(this.pageState);
  }
  private processCols() {
    if (this.todoTab !== TodoTab.All) {
      this.cols = this.cols.map((col) => {
        if (col.name === 'IsCompleted') {
          col.render = false;
        }
        return col;
      });
    } else {
      this.cols = this.cols.map((col) => {
        if (col.name === 'IsCompleted') {
          col.render = true;
        }
        return col;
      });
    }
  }
  ngOnDestroy(): void {
    removeLocalStorageItem(LocalStorageKeys.GetTodos);
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
