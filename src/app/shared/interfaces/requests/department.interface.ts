export interface IDepartment {
  id: number;
  departmentName: string;
  employeesCount: number;
}

export interface IGetDepartmentRes {
  iterableData: IDepartment[];
  status: string;
  message: string;
  statusCode: number;
}
