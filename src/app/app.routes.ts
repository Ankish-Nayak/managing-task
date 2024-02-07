import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PortalComponent } from './components/portal/portal.component';
import { authGuard } from './shared/guards/auth/auth.guard';
import { END_POINTS } from './utils/constants';

// TODO: make a class to get url to particular endpoints and also have push, pop as method in it.
export const routes: Routes = [
  {
    component: PortalComponent,
    path: END_POINTS.portal,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    loadChildren: () =>
      import('./components/portal/portal.routes').then((mod) => mod.routes),
  },
  {
    component: DashboardComponent,
    path: END_POINTS.dashboard,
    canActivate: [authGuard],
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
    pathMatch: 'full',
    redirectTo: END_POINTS.dashboard,
  },
  {
    path: '**',
    component: LoginComponent,
    pathMatch: 'full',
  },
];
