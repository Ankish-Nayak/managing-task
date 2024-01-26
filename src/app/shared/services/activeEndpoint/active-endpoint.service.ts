import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActiveEndpointService {
  private _activeEndpointSource = new Subject<string>();
  activeEndpointMessage$ = this._activeEndpointSource.asObservable();
  constructor() {}
  updateActiveEndpoint(endPoint: string) {
    this._activeEndpointSource.next(endPoint);
  }
}
