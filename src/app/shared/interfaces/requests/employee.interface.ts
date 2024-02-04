export interface IGetEmployees {
  status: string;
  message: string;
  statusCode: number;
  iterableData: IEmployee[];
  count: number;
}

export interface IEmployee {
  id: number;
  name: string;
  email: string;
  employeeType: number;
  address: string;
  city: string;
  country: string;
  phone: string;
  departmentID: number;
  departmentName: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateEmpoyee {
  id: number;
  name: string;
  email: string;
  employeeType: number;
  address: string;
  city: string;
  country: string;
  phone: string;
  departmentID: number;
  departmentName: string;
}

export interface IGetEmployeesQueryParams {
  isPagination: boolean;
  index: number;
  take: number;
  search: string;
  orders: number;
  orderBy: string;
}

export class GetEmployeesQueryParams implements IGetEmployeesQueryParams {
  isPagination: boolean;
  index: number;
  take: number;
  search: string;
  orders: number;
  orderBy: string;
  constructor(params: Partial<IGetEmployeesQueryParams>) {
    this.isPagination = params.isPagination ?? false;
    this.index = params.index ?? 0;
    this.take = params.take ?? 0;
    this.search = params.search ?? '';
    this.orders = params.orders ?? 0;
    this.orderBy = params.orderBy ?? '';
  }
}
