import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { authGuard } from './shared/guards/auth/auth.guard';
import { END_POINTS } from './utils/constants';

// TODO: make a class to get url to particular endpoints and also have push, pop as method in it.
export const routes: Routes = [
  {
    loadComponent: () =>
      import('./components/portal/portal.component').then(
        (m) => m.PortalComponent,
      ),
    path: END_POINTS.portal,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    loadChildren: () =>
      import('./components/portal/portal.routes').then((mod) => mod.routes),
  },
  {
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
    path: END_POINTS.dashboard,
    canActivate: [authGuard],
  },
  {
    loadComponent: () =>
      import('./components/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
    path: END_POINTS.login,
  },
  {
    loadComponent: () =>
      import('./components/auth/signup/signup.component').then(
        (m) => m.SignupComponent,
      ),
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
