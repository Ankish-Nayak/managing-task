import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TodoListComponent } from './components/dashboard/todo-list/todo-list.component';
import { UpsertTodoComponent } from './components/dashboard/upsert-todo/upsert-todo.component';
import { DepartmentListComponent } from './components/department-list/department-list.component';
import { authGuard } from './shared/guards/auth.guard';
import { END_POINTS } from './utils/constants';
import { AdminListComponent } from './components/dashboard/admin-list/admin-list.component';
import { UpsertAdminComponent } from './components/dashboard/admin-list/upsert-admin/upsert-admin.component';
import { TodoDetailComponent } from './components/dashboard/todo-list/todo-detail/todo-detail.component';

export const routes: Routes = [
  {
    component: LoginComponent,
    path: END_POINTS.login,
  },
  {
    component: SignupComponent,
    path: END_POINTS.sigup,
  },
  {
    component: DashboardComponent,
    path: END_POINTS.dashboard,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { component: DepartmentListComponent, path: '' },
      {
        component: TodoListComponent,
        path: END_POINTS.todoList,
      },
      {
        component: TodoDetailComponent,
        path: END_POINTS.todoDetail,
      },
      {
        component: UpsertTodoComponent,
        path: END_POINTS.createTodo,
      },
      {
        component: UpsertTodoComponent,
        path: END_POINTS.updateTodo,
      },
      {
        component: UpsertAdminComponent,
        path: END_POINTS.createAdmin,
      },
      {
        component: AdminListComponent,
        path: END_POINTS.adminList,
      },
      {
        component: UpsertAdminComponent,
        path: END_POINTS.updateAdmin,
      },
    ],
  },
  {
    path: '**',
    component: LoginComponent,
    pathMatch: 'full',
  },
];
