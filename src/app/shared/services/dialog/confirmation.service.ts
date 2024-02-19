import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  private _confirmation = new Subject<boolean>();
  public confirmationSource$ = this._confirmation.asObservable();
  constructor() {}
  public confirm(confirmation: boolean) {
    this._confirmation.next(confirmation);
  }
  public reset() {
    this._confirmation.next(false);
  }
}
