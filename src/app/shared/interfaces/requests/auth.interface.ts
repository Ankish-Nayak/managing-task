import { IEmployee } from './employee.interface';
export interface IGetProfile {
  status: string;
  message: string;
  statusCode: number;
  data: IEmployee;
}
