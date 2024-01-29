import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { END_POINTS } from '../../../utils/constants';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.me()) {
    return true;
  } else {
    router.navigate([`./${END_POINTS.login}`]);
    return false;
  }
};
