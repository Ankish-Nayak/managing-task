export interface IGetNotifications {
  status: string;
  message: string;
  statusCode: number;
  iterableData: INotification[];
}

export interface INotification {
  id: number;
  message: string;
  isSeen: boolean;
  created: string; // Assuming created is in ISO format
  todoId: number;
}
export interface IGetNotificationPostData {
  isSeen: boolean | null;
}

export interface ISetNotificationMarkAsReadPostData {
  notificationIDs: number[];
}

export interface IGetNotificationsQueryParams {
  isPagination: boolean;
  index: number;
  take: number;
  search: string;
  isSeen: null | boolean;
}

export class GetNotificationsQueryParams
  implements IGetNotificationsQueryParams
{
  public isPagination: boolean;
  public index: number;
  public take: number;
  public search: string;
  public isSeen: null | boolean;
  constructor(data: Partial<IGetNotificationsQueryParams>) {
    this.isPagination = data.isPagination ?? false;
    this.index = data.index ?? 0;
    this.take = data.take ?? 10;
    this.search = data.search ?? '';
    this.isSeen = data.isSeen ?? null;
  }
}
