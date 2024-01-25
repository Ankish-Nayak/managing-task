import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TodoListComponent } from './components/dashboard/todo-list/todo-list.component';
import { UpsertTodoComponent } from './components/dashboard/upsert-todo/upsert-todo.component';
import { DepartmentListComponent } from './components/department-list/department-list.component';
import { authGuard } from './shared/guards/auth.guard';
import { END_POINTS } from './utils/constants';

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
        path: 'todos',
      },
      {
        component: UpsertTodoComponent,
        path: 'create-todo',
      },
      {
        component: UpsertTodoComponent,
        path: 'update-todo/:id',
      },
    ],
  },
  {
    path: '**',
    component: LoginComponent,
    pathMatch: 'full',
  },
];
