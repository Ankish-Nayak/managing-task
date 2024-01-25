import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DepartmentListComponent } from './components/department-list/department-list.component';
import { END_POINTS } from './utils/constants';
import { TodoListComponent } from './components/dashboard/todo-list/todo-list.component';
import { CreateTodoComponent } from './components/dashboard/create-todo/create-todo.component';
import { UpdateTodoComponent } from './components/dashboard/update-todo/update-todo.component';
import { authGuard } from './shared/guards/auth.guard';

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
        component: CreateTodoComponent,
        path: 'create-todo',
      },
      {
        component: UpdateTodoComponent,
        path: 'update-todo/:id',
      },
    ],
  },
  {
    path: '**',
    component: LoginComponent,
    pathMatch: 'full',
  },
  // { component: DepartmentListComponent, path: END_POINTS.departmentList },
];
