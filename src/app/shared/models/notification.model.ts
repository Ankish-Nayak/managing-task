import { Injectable } from '@angular/core';
import { INotification } from '../interfaces/requests/notification.interface';
import { Adapter } from './adapter';

export class Notification implements INotification {
  id: number;
  message: string;
  isSeen: boolean;
  created: string;
  todoId: number;

  constructor(
    id: number,
    message: string,
    isSeen: boolean,
    created: string,
    todoId: number,
  ) {
    this.id = id;
    this.message = message;
    this.isSeen = isSeen;
    this.created = created;
    this.todoId = todoId;
  }
}

@Injectable({
  providedIn: 'root',
})
export class NotificationAdapter implements Adapter<Notification> {
  adapt(item: INotification): Notification {
    return new Notification(
      item.id,
      item.message,
      item.isSeen,
      item.created,
      item.todoId,
    );
  }

  adaptArray(items: INotification[]): Notification[] {
    return items.map((item) => this.adapt(item));
  }
}
