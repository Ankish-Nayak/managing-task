import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { LocalStorageKeys } from '../../../utils/constants';
import { getNotificationType } from '../../../utils/get-notification-type';
import { getLocalStorageItem } from '../../../utils/localStorageCRUD';
import {
  IGetNotificationPostData,
  IGetNotifications,
  ISetNotificationMarkAsReadPostData,
} from '../../interfaces/requests/notification.interface';
import { IMarkTodoPostData } from '../../interfaces/requests/toto.interface';

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
  getNotifications(data: IGetNotificationPostData) {
    return this.http
      .post<IGetNotifications>(`${this.apiUrl}/GetNotifications`, data, {
        withCredentials: true,
        headers: this.Headers,
      })
      .pipe(
        map((res) =>
          res.iterableData.map((n) => ({
            ...n,
            title: 'Task ' + getNotificationType(n.message),
          })),
        ),
      );
  }
  markNotificationAsRead(id: number) {
    return this.markNotificationsAsRead({
      notificationIDs: [id],
    });
  }
  markNotificationsAsRead(data: ISetNotificationMarkAsReadPostData) {
    return this.http.post(`${this.apiUrl}/SetMarkAsRead`, data, {
      withCredentials: true,
      headers: this.Headers,
    });
  }
}
