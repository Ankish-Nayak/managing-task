export interface ITask {
  title: string;
  description: string;
  isCompleted: boolean;
  employeeId: number;
  id: number;
  departmentId: number;
  employeeName: string;
  departmentName: string;
  assignBy: number;
}

export interface IGetTodosRes {
  status: string;
  message: string;
  statusCode: number;
  iterableData: ITask[];
}

export interface ICreateTodoPostData {
  title: string;
  description: string;
  isCompleted: boolean;
  employeeId: number;
}
