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
  createdDate: string;
  updatedDate: string;
  deadLine: null | string;
}

export interface IGetTodosRes {
  status: string;
  count: number;
  message: string;
  statusCode: number;
  iterableData: ITask[];
}

export interface ICreateTodoPostData {
  title: string;
  description: string;
  isCompleted: boolean;
  employeeId: number;
  deadLine: string;
}

export interface IGetTodosQueryParams {
  isPagination: boolean;
  index: number;
  take: number;
  search: string;
  orders: number;
  orderBy: string;
  isCompleted: boolean | null;
}

export interface IUpdateTodoPostData {
  title: string;
  description: string;
  isCompleted: boolean;
  employeeId: number;
  deadLine: string;
}

export interface IMarkTodoPostData {
  isCompleted: boolean;
}

export class GetTodosQueryParams implements IGetTodosQueryParams {
  public isPagination: boolean;
  public index: number;
  public take: number;
  public search: string;
  public orders: number;
  public orderBy: string;
  public isCompleted: boolean | null;
  constructor(params: Partial<IGetTodosQueryParams>) {
    this.isPagination = params.isPagination ?? false;
    this.index = params.index ?? 0;
    this.take = params.take ?? 0;
    this.search = params.search ?? '';
    this.orders = params.orders ?? 0;
    this.orderBy = params.orderBy ?? '';
    this.isCompleted = params.isCompleted ?? null;
  }
}
