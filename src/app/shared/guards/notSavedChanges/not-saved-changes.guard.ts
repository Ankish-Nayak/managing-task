import { CanDeactivateFn } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { UpsertProfileComponent } from '../../../components/dashboard/upsert-profile/upsert-profile.component';

export const notSavedChangesGuard: CanDeactivateFn<UpsertProfileComponent> = (
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
