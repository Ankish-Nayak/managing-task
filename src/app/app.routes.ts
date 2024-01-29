import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TodoListComponent } from './components/dashboard/todo-list/todo-list.component';
import { UpsertTodoComponent } from './components/dashboard/upsert-todo/upsert-todo.component';
import { DepartmentListComponent } from './components/department-list/department-list.component';
import { authGuard } from './shared/guards/auth/auth.guard';
import { END_POINTS, USER_ROLES } from './utils/constants';
import { AdminListComponent } from './components/dashboard/admin-list/admin-list.component';
import { UpsertAdminComponent } from './components/dashboard/admin-list/upsert-admin/upsert-admin.component';
import { TodoDetailComponent } from './components/dashboard/todo-list/todo-detail/todo-detail.component';
import { EmployeeListComponent } from './components/dashboard/employee-list/employee-list.component';
import { NotAllowedUserComponent } from './components/not-allowed-user/not-allowed-user.component';
import { userBasedAuthGuard } from './shared/guards/userBasedAuth/user-based-auth.guard';

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
        canActivate: [userBasedAuthGuard],
        data: {
          roles: [USER_ROLES.Admin, USER_ROLES.SuperAdmin],
        },
      },
      {
        component: UpsertTodoComponent,
        path: END_POINTS.updateTodo,
        canActivate: [userBasedAuthGuard],
        data: {
          roles: [USER_ROLES.Admin, USER_ROLES.SuperAdmin],
        },
      },
      {
        component: UpsertAdminComponent,
        path: END_POINTS.createAdmin,
        canActivate: [userBasedAuthGuard],
        data: {
          roles: [USER_ROLES.Admin, USER_ROLES.SuperAdmin],
        },
      },
      {
        component: AdminListComponent,
        path: END_POINTS.adminList,
        canActivate: [userBasedAuthGuard],
        data: {
          roles: [USER_ROLES.Admin, USER_ROLES.SuperAdmin],
        },
      },
      {
        component: UpsertAdminComponent,
        path: END_POINTS.updateAdmin,
        canActivate: [userBasedAuthGuard],
        data: {
          roles: [USER_ROLES.Admin, USER_ROLES.SuperAdmin],
        },
      },
      {
        component: EmployeeListComponent,
        path: END_POINTS.employeeList,
        canActivate: [userBasedAuthGuard],
        data: {
          roles: [USER_ROLES.Admin, USER_ROLES.SuperAdmin],
        },
      },
      { component: NotAllowedUserComponent, path: END_POINTS.notAllowedUser },
    ],
  },
  {
    path: '**',
    component: LoginComponent,
    pathMatch: 'full',
  },
];
