export interface IGetEmployees {
  status: string;
  message: string;
  statusCode: number;
  iterableData: Employee[];
}

interface Employee {
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
