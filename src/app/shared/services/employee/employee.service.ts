import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AUTH_TOKEN, EMPLOYEE_TYPE } from '../../../utils/constants';
import {
  IEmployee,
  IGetEmployees,
  IUpdateEmpoyee,
} from '../../interfaces/requests/employee.interface';
import { map, of } from 'rxjs';
import { Employee } from '../../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = `${environment.BASE_URL}`;
  constructor(private http: HttpClient) {}
  get Headers() {
    const token = localStorage.getItem(AUTH_TOKEN);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
  getEmployee(id: number) {
    const employee: Employee = JSON.parse(
      localStorage.getItem(`employee/${id}`)!,
    );
    return of(employee);
  }
  getAdmins(page: number) {
    return this.http
      .get<IGetEmployees>(`${this.apiUrl}/employees/${page}`, {
        withCredentials: true,
        headers: this.Headers,
      })
      .pipe(
        map((res) => {
          const newIterableData = res.iterableData.filter(
            (e) => e.employeeType.toString() === EMPLOYEE_TYPE.admin,
          );
          return {
            ...res,
            iterableData: newIterableData,
          };
        }),
      );
  }
  getEmployees(page: number) {
    return this.http
      .get<IGetEmployees>(`${this.apiUrl}/employees/${page}`, {
        withCredentials: true,
        headers: this.Headers,
      })
      .pipe(
        map((res) => {
          const newIterableData = res.iterableData.filter(
            (e) => e.employeeType.toString() === EMPLOYEE_TYPE.employee,
          );
          return {
            ...res,
            iterableData: newIterableData,
          };
        }),
      );
  }
  deleteEmployee(id: number) {
    return this.http.delete(`${this.apiUrl}/deleteEmployee/${id}`, {
      withCredentials: true,
      headers: this.Headers,
    });
  }
  updateEmployee(id: number, data: IUpdateEmpoyee) {
    console.log(data);
    return this.http.put(`${this.apiUrl}/updateuser/${id}`, data, {
      withCredentials: true,
      headers: this.Headers,
    });
  }
}
