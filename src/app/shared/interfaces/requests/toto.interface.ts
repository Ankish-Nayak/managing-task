interface ITask {
  title: string;
  description: string;
  isCompleted: boolean;
  id: number;
  employeeId: number;
  assignBy: number;
}

export interface IGetTodosRes {
  status: string;
  message: string;
  statusCode: number;
  iterableData: ITask[];
}
