export interface ILoginRes {
  token: string;
  data: UserData;
  status: string;
  message: string;
  statusCode: number;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  employeeType: number;
  address: string;
  city: string;
  country: string;
  phone: string;
  departmentID: number;
  departmentName: string | null;
}
