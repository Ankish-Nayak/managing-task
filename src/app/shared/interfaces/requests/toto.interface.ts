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

export interface IGetTodosQueryParams {
  isPagination: boolean;
  index: number;
  take: number;
  search: string;
  orders: number;
  orderBy: string;
}

export interface IUpdateTodoPostData {
  title: string;
  description: string;
  isCompleted: boolean;
  employeeId: number;
}

export interface IMarkTodoPostData {
  isCompleted: boolean;
}

export class GetTodosQueryParams implements IGetTodosQueryParams {
  isPagination: boolean;
  index: number;
  take: number;
  search: string;
  orders: number;
  orderBy: string;
  constructor(params: Partial<IGetTodosQueryParams>) {
    this.isPagination = params.isPagination ?? false;
    this.index = params.index ?? 0;
    this.take = params.take ?? 0;
    this.search = params.search ?? '';
    this.orders = params.orders ?? 0;
    this.orderBy = params.orderBy ?? '';
  }
}
