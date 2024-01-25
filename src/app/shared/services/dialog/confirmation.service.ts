import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  private _confirmation = new Subject<boolean | null>();
  confirmationSource$ = this._confirmation.asObservable();
  constructor() {}
  confirm(confirmation: boolean) {
    this._confirmation.next(confirmation);
  }
  reset() {
    this._confirmation.next(null);
  }
}
