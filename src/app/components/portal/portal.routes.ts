import { Routes } from '@angular/router';
import { AdminListComponent } from '../../components/dashboard/admin-list/admin-list.component';
import { UpsertAdminComponent } from '../../components/dashboard/admin-list/upsert-admin/upsert-admin.component';
import { EmployeeListComponent } from '../../components/dashboard/employee-list/employee-list.component';
import { TodoDetailComponent } from '../../components/dashboard/todo-list/todo-detail/todo-detail.component';
import { TodoListComponent } from '../../components/dashboard/todo-list/todo-list.component';
import { UpsertTodoComponent } from '../../components/dashboard/upsert-todo/upsert-todo.component';
import { DepartmentListComponent } from '../../components/department-list/department-list.component';
import { NotAllowedUserComponent } from '../../components/not-allowed-user/not-allowed-user.component';
import { ProfileComponent } from '../../components/profile/profile.component';
import { notSavedChangesGuard } from '../../shared/guards/notSavedChanges/not-saved-changes.guard';
import { userBasedAuthGuard } from '../../shared/guards/userBasedAuth/user-based-auth.guard';
import { PaginationComponent } from '../../shared/paginations/pagination/pagination.component';
import { END_POINTS, UserRole } from '../../utils/constants';

export const routes: Routes = [
  {
    // loadComponent: () => import('../../components/department-list/department-list.component').then(m => m.DepartmentListComponent),
    component: DepartmentListComponent,
    path: END_POINTS.departmentList,
  },
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
  {
    component: EmployeeListComponent,
    path: END_POINTS.employeesByDepartment,
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
    component: ProfileComponent,
    path: END_POINTS.upsertProfile,
    canDeactivate: [notSavedChangesGuard],
  },
  {
    component: UpsertTodoComponent,
    path: END_POINTS.assignTask,
  },
];
