import { Routes } from '@angular/router';
import { AdminListComponent } from '../../components/dashboard/admin-list/admin-list.component';
import { NotAllowedUserComponent } from '../../components/not-allowed-user/not-allowed-user.component';
import { notSavedChangesGuard } from '../../shared/guards/notSavedChanges/not-saved-changes.guard';
import { userBasedAuthGuard } from '../../shared/guards/userBasedAuth/user-based-auth.guard';
import { PaginationComponent } from '../../sharedComponents/paginations/pagination/pagination.component';
import { END_POINTS, UserRole } from '../../utils/constants';
import { DatePickerComponent } from '../../sharedComponents/datePickers/date-picker/date-picker.component';
import { TestComponent } from '../test/test.component';

export const routes: Routes = [
  {
    loadComponent: () =>
      import('../../components/department-list/department-list.component').then(
        (m) => m.DepartmentListComponent,
      ),
    path: END_POINTS.departmentList,
  },
  {
    loadComponent: () =>
      import('../../components/dashboard/todo-list/todo-list.component').then(
        (m) => m.TodoListComponent,
      ),
    path: END_POINTS.todoList,
  },
  {
    loadComponent: () =>
      import(
        '../../components/dashboard/todo-list/todo-detail/todo-detail.component'
      ).then((m) => m.TodoDetailComponent),
    path: END_POINTS.todoDetail,
  },
  {
    loadComponent: () =>
      import(
        '../../components/dashboard/upsert-todo/upsert-todo.component'
      ).then((m) => m.UpsertTodoComponent),
    path: END_POINTS.createTodo,
    canActivate: [userBasedAuthGuard],
    data: {
      roles: [UserRole.Admin, UserRole.SuperAdmin],
    },
  },
  {
    loadComponent: () =>
      import(
        '../../components/dashboard/upsert-todo/upsert-todo.component'
      ).then((m) => m.UpsertTodoComponent),
    path: END_POINTS.updateTodo,
    canActivate: [userBasedAuthGuard],
    data: {
      roles: [UserRole.Admin, UserRole.SuperAdmin],
    },
  },
  {
    loadComponent: () =>
      import(
        '../../components/dashboard/admin-list/upsert-admin/upsert-admin.component'
      ).then((m) => m.UpsertAdminComponent),
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
    loadComponent: () =>
      import(
        '../../components/dashboard/admin-list/upsert-admin/upsert-admin.component'
      ).then((m) => m.UpsertAdminComponent),
    path: END_POINTS.updateAdmin,
    canActivate: [userBasedAuthGuard],
    data: {
      roles: [UserRole.Admin, UserRole.SuperAdmin],
    },
  },
  {
    loadComponent: () =>
      import(
        '../../components/dashboard/employee-list/employee-list.component'
      ).then((m) => m.EmployeeListComponent),
    path: END_POINTS.employeeList,
    canActivate: [userBasedAuthGuard],
    data: {
      roles: [UserRole.Admin, UserRole.SuperAdmin],
    },
  },
  {
    loadComponent: () =>
      import(
        '../../components/dashboard/employee-list/employee-list.component'
      ).then((m) => m.EmployeeListComponent),
    path: END_POINTS.employeesByDepartment,
    canActivate: [userBasedAuthGuard],
    data: {
      roles: [UserRole.Admin, UserRole.SuperAdmin],
    },
  },
  { component: NotAllowedUserComponent, path: END_POINTS.notAllowedUser },
  {
    loadComponent: () =>
      import('../../components/profile/profile.component').then(
        (m) => m.ProfileComponent,
      ),
    path: END_POINTS.profile,
  },
  {
    component: TestComponent,
    path: END_POINTS.test,
  },
  {
    loadComponent: () =>
      import('../../components/profile/profile.component').then(
        (m) => m.ProfileComponent,
      ),
    path: END_POINTS.upsertProfile,
    canDeactivate: [notSavedChangesGuard],
  },
  {
    loadComponent: () =>
      import(
        '../../components/dashboard/upsert-todo/upsert-todo.component'
      ).then((m) => m.UpsertTodoComponent),
    path: END_POINTS.assignTask,
  },
];
