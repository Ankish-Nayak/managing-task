import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActiveEndpointService {
  private _activeEndpointSource = new Subject<string>();
  public activeEndpointMessage$ = this._activeEndpointSource.asObservable();
  constructor() {}
  public updateActiveEndpoint(endPoint: string) {
    this._activeEndpointSource.next(endPoint);
  }
}
