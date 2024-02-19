import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { LocalStorageKeys } from '../../../utils/constants';
import { getNotificationType } from '../../../utils/get-notification-type';
import { getLocalStorageItem } from '../../../utils/localStorageCRUD';
import {
  IGetNotificationPostData,
  IGetNotifications,
  ISetNotificationMarkAsReadPostData,
} from '../../interfaces/requests/notification.interface';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _openNotification = new BehaviorSubject<boolean>(false);
  public openNotificationMessageSource$ = this._openNotification.asObservable();
  private apiUrl = `${environment.BASE_URL}/Notification`;
  constructor(private http: HttpClient) {}
  public get Headers() {
    const token = getLocalStorageItem(LocalStorageKeys.AuthToken);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
  public openNotification() {
    if (this._openNotification.getValue()) {
      return;
    }
    this._openNotification.next(true);
  }
  public closeNotification() {
    if (!this._openNotification.getValue()) {
      return;
    }
    this._openNotification.next(false);
  }
  public getNotifications(data: IGetNotificationPostData) {
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
  public markNotificationAsRead(id: number) {
    return this.markNotificationsAsRead({
      notificationIDs: [id],
    });
  }
  public markNotificationsAsRead(data: ISetNotificationMarkAsReadPostData) {
    return this.http.post(`${this.apiUrl}/SetMarkAsRead`, data, {
      withCredentials: true,
      headers: this.Headers,
    });
  }
}
