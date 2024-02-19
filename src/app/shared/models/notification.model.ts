import { Injectable } from '@angular/core';
import { INotification } from '../interfaces/requests/notification.interface';
import { Adapter } from './adapter';
import { getNotificationType } from '../../utils/get-notification-type';

export class Notification implements INotification {
  public id: number;
  public message: string;
  public isSeen: boolean;
  public created: string;
  public todoId: number;
  public title: string;

  constructor(
    id: number,
    message: string,
    isSeen: boolean,
    created: string,
    todoId: number,
    title: string,
  ) {
    this.id = id;
    this.message = message;
    this.isSeen = isSeen;
    this.created = created;
    this.todoId = todoId;
    this.title = title;
  }
}

@Injectable({
  providedIn: 'root',
})
export class NotificationAdapter implements Adapter<Notification> {
  public adapt(item: INotification): Notification {
    return new Notification(
      item.id,
      item.message,
      item.isSeen,
      item.created,
      item.todoId,
      getNotificationType(item.message),
    );
  }

  public adaptArray(items: INotification[]): Notification[] {
    return items.map((item) => this.adapt(item));
  }
}
