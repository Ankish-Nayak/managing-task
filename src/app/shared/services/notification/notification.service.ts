import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { LocalStorageKeys } from '../../../utils/constants';
import { getLocalStorageItem } from '../../../utils/localStorageCRUD';
import { IGetNotifications } from '../../interfaces/requests/notification.interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = `${environment.BASE_URL}/Notification`;
  constructor(private http: HttpClient) {}
  get Headers() {
    const token = getLocalStorageItem(LocalStorageKeys.AuthToken);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
  getNotifications() {
    return this.http
      .post<IGetNotifications>(
        `${this.apiUrl}/GetNotifications`,
        { isSeen: true },
        {
          withCredentials: true,
          headers: this.Headers,
        },
      )
      .pipe(map((res) => res.iterableData));
  }
}
