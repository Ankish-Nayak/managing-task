import { CanDeactivateFn } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { ProfileComponent } from '../../../components/profile/profile.component';

export const notSavedChangesGuard: CanDeactivateFn<ProfileComponent> = (
  component,
  _currentRoute,
  _currentState,
  _nextState,
) => {
  return component.hasUnSavedChanges$.pipe(
    switchMap((hasUnSavedChanges: boolean) => {
      if (hasUnSavedChanges) {
        return component.canDeactivate();
      } else {
        return of(true);
      }
    }),
  );
};
