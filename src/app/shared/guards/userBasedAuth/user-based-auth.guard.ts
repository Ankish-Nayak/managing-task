import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { END_POINTS } from '../../../utils/constants';
import { TEmployee } from '../../interfaces/employee.type';
import { AuthService } from '../../services/auth/auth.service';

export const userBasedAuthGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const allowedRoles = route.data['roles'] as Array<TEmployee>;
  const router = inject(Router);
  console.log(allowedRoles);
  return authService.userTypeMessage$.pipe(
    map((res) => {
      console.log(res);
      if (res !== null && allowedRoles.includes(res)) {
        console.log('yes');
        return true;
      } else {
        router.navigate([END_POINTS.notAllowedUser]);
        return false;
      }
    }),
  );
};
