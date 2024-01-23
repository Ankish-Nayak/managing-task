import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  {
    component: LoginComponent,
    path: '',
  },
  {
    component: SignupComponent,
    path: 'signup',
  },
  { component: DashboardComponent, path: 'dashboard' },
];
