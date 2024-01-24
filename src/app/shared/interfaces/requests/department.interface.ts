export interface IDepartment {
  id: number;
  departmentName: string;
}

export interface IGetDepartmentRes {
  iterableData: IDepartment[];
  status: string;
  message: string;
  statusCode: number;
}
