import { Observable } from 'rxjs';

export interface BlockNavigationIfChange {
  hasUnSavedChanges$: Observable<boolean>;
}
