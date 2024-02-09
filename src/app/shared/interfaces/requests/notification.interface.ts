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
