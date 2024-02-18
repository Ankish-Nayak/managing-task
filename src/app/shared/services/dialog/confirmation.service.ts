import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  private _confirmation = new Subject<boolean>();
  confirmationSource$ = this._confirmation.asObservable();
  constructor() {}
  confirm(confirmation: boolean) {
    this._confirmation.next(confirmation);
  }
  reset() {
    this._confirmation.next(false);
  }
}
