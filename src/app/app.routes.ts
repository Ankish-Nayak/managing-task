import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DepartmentListComponent } from './components/department-list/department-list.component';
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
  { component: DashboardComponent, path: END_POINTS.dashboard },
  { component: DepartmentListComponent, path: END_POINTS.departmentList },
];
