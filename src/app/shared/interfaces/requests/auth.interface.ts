import { IEmployee } from './employee.interface';
export interface IGetProfile {
  status: string;
  message: string;
  statusCode: number;
  data: IEmployee;
}

// interface IEmployee {
//   id: number;
//   name: string;
//   email: string;
//   employeeType: number;
//   address: string;
//   city: string;
//   country: string;
//   phone: string;
//   departmentID: number;
//   departmentName: string;
// }
