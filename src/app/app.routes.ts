import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { AdminListComponent } from './components/dashboard/admin-list/admin-list.component';
import { UpsertAdminComponent } from './components/dashboard/admin-list/upsert-admin/upsert-admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmployeeListComponent } from './components/dashboard/employee-list/employee-list.component';
import { TodoDetailComponent } from './components/dashboard/todo-list/todo-detail/todo-detail.component';
import { TodoListComponent } from './components/dashboard/todo-list/todo-list.component';
import { UpsertTodoComponent } from './components/dashboard/upsert-todo/upsert-todo.component';
import { DepartmentListComponent } from './components/department-list/department-list.component';
import { NotAllowedUserComponent } from './components/not-allowed-user/not-allowed-user.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './shared/guards/auth/auth.guard';
import { userBasedAuthGuard } from './shared/guards/userBasedAuth/user-based-auth.guard';
import { PaginationComponent } from './shared/paginations/pagination/pagination.component';
import { END_POINTS, UserRole } from './utils/constants';
import { UpsertProfileComponent } from './components/dashboard/upsert-profile/upsert-profile.component';
import { notSavedChangesGuard } from './shared/guards/notSavedChanges/not-saved-changes.guard';
import { PortalComponent } from './components/portal/portal.component';

// TODO: make a class to get url to particular endpoints and also have push, pop as method in it.
export const routes: Routes = [
  {
    component: PortalComponent,
    path: END_POINTS.portal,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { component: DepartmentListComponent, path: END_POINTS.departmentList },
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
          roles: [UserRole.Admin, UserRole.SuperAdmin],
        },
      },
      {
        component: UpsertTodoComponent,
        path: END_POINTS.updateTodo,
        canActivate: [userBasedAuthGuard],
        data: {
          roles: [UserRole.Admin, UserRole.SuperAdmin],
        },
      },
      {
        component: UpsertAdminComponent,
        path: END_POINTS.createAdmin,
        canActivate: [userBasedAuthGuard],
        data: {
          roles: [UserRole.Admin, UserRole.SuperAdmin],
        },
      },
      {
        component: AdminListComponent,
        path: END_POINTS.adminList,
        canActivate: [userBasedAuthGuard],
        data: {
          roles: [UserRole.Admin, UserRole.SuperAdmin],
        },
      },
      {
        component: UpsertAdminComponent,
        path: END_POINTS.updateAdmin,
        canActivate: [userBasedAuthGuard],
        data: {
          roles: [UserRole.Admin, UserRole.SuperAdmin],
        },
      },
      {
        component: EmployeeListComponent,
        path: END_POINTS.employeeList,
        canActivate: [userBasedAuthGuard],
        data: {
          roles: [UserRole.Admin, UserRole.SuperAdmin],
        },
      },
      { component: NotAllowedUserComponent, path: END_POINTS.notAllowedUser },
      {
        component: ProfileComponent,
        path: END_POINTS.profile,
      },
      {
        component: PaginationComponent,
        path: END_POINTS.test,
      },
      {
        component: UpsertProfileComponent,
        path: END_POINTS.upsertProfile,
        canDeactivate: [notSavedChangesGuard],
      },
    ],
  },
  {
    component: DashboardComponent,
    path: END_POINTS.dashboard,
    //   canActivate: [authGuard],
    //   canActivateChild: [authGuard],
    //   children: [
    //     { component: DepartmentListComponent, path: END_POINTS.departmentList },
    //     {
    //       component: TodoListComponent,
    //       path: END_POINTS.todoList,
    //     },
    //     {
    //       component: TodoDetailComponent,
    //       path: END_POINTS.todoDetail,
    //     },
    //     {
    //       component: UpsertTodoComponent,
    //       path: END_POINTS.createTodo,
    //       canActivate: [userBasedAuthGuard],
    //       data: {
    //         roles: [UserRole.Admin, UserRole.SuperAdmin],
    //       },
    //     },
    //     {
    //       component: UpsertTodoComponent,
    //       path: END_POINTS.updateTodo,
    //       canActivate: [userBasedAuthGuard],
    //       data: {
    //         roles: [UserRole.Admin, UserRole.SuperAdmin],
    //       },
    //     },
    //     {
    //       component: UpsertAdminComponent,
    //       path: END_POINTS.createAdmin,
    //       canActivate: [userBasedAuthGuard],
    //       data: {
    //         roles: [UserRole.Admin, UserRole.SuperAdmin],
    //       },
    //     },
    //     {
    //       component: AdminListComponent,
    //       path: END_POINTS.adminList,
    //       canActivate: [userBasedAuthGuard],
    //       data: {
    //         roles: [UserRole.Admin, UserRole.SuperAdmin],
    //       },
    //     },
    //     {
    //       component: UpsertAdminComponent,
    //       path: END_POINTS.updateAdmin,
    //       canActivate: [userBasedAuthGuard],
    //       data: {
    //         roles: [UserRole.Admin, UserRole.SuperAdmin],
    //       },
    //     },
    //     {
    //       component: EmployeeListComponent,
    //       path: END_POINTS.employeeList,
    //       canActivate: [userBasedAuthGuard],
    //       data: {
    //         roles: [UserRole.Admin, UserRole.SuperAdmin],
    //       },
    //     },
    //     { component: NotAllowedUserComponent, path: END_POINTS.notAllowedUser },
    //     {
    //       component: ProfileComponent,
    //       path: END_POINTS.profile,
    //     },
    //     {
    //       component: PaginationComponent,
    //       path: END_POINTS.test,
    //     },
    //     {
    //       component: UpsertProfileComponent,
    //       path: END_POINTS.upsertProfile,
    //       canDeactivate: [notSavedChangesGuard],
    //     },
    //   ],
  },
  {
    component: LoginComponent,
    path: END_POINTS.login,
  },
  {
    component: SignupComponent,
    path: END_POINTS.sigup,
  },
  {
    path: '**',
    canActivate: [authGuard],
    component: DashboardComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    component: LoginComponent,
    pathMatch: 'full',
  },
];
