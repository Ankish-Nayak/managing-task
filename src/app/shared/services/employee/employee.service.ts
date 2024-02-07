import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { EMPLOYEE_TYPE, LocalStorageKeys } from '../../../utils/constants';
import { getLocalStorageItem } from '../../../utils/localStorageCRUD';
import {
  GetEmployeesQueryParams,
  IGetEmployees,
  IGetEmployeesQueryParams,
  IUpdateEmpoyee,
} from '../../interfaces/requests/employee.interface';
import { Employee } from '../../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = `${environment.BASE_URL}`;
  constructor(private http: HttpClient) {}
  get Headers() {
    const token = getLocalStorageItem(LocalStorageKeys.AuthToken);
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
  getAdmins(queryParams: Partial<IGetEmployeesQueryParams>) {
    const transformedQueryParmas = new GetEmployeesQueryParams(queryParams);
    return this.http
      .post<IGetEmployees>(`${this.apiUrl}/employees`, transformedQueryParmas, {
        withCredentials: true,
        headers: this.Headers,
      })
      .pipe(
        map((res) => {
          const newIterableData = res.iterableData.filter(
            (e) => e.employeeType === EMPLOYEE_TYPE.admin,
          );
          return {
            ...res,
            iterableData: newIterableData,
            count: newIterableData.length,
          };
        }),
      );
  }
  getEmployeesByDepartment(
    departmentId: number,
    queryParams: Partial<IGetEmployeesQueryParams>,
  ) {
    return this.getEmployees(queryParams).pipe(
      map((res) => {
        return {
          ...res,
          iterableData: res.iterableData.filter(
            (employee) => employee.departmentID === departmentId,
          ),
        };
      }),
    );
  }
  getEmployees(queryParams: Partial<IGetEmployeesQueryParams>) {
    const transformedQueryParmas = new GetEmployeesQueryParams(queryParams);
    return this.http
      .post<IGetEmployees>(
        `${this.apiUrl}/employees/`,
        transformedQueryParmas,
        {
          withCredentials: true,
          headers: this.Headers,
        },
      )
      .pipe(
        map((res) => {
          const newIterableData = res.iterableData.filter(
            (e) => e.employeeType === EMPLOYEE_TYPE.employee,
          );
          return {
            ...res,
            iterableData: newIterableData,
            count: newIterableData.length,
          };
        }),
      );
  }
  getEmployeesAndAdmins(queryParams: Partial<IGetEmployeesQueryParams>) {
    const transformedQueryParams = new GetEmployeesQueryParams(queryParams);
    transformedQueryParams.orderBy =
      transformedQueryParams.orderBy.charAt(0).toUpperCase() +
      transformedQueryParams.orderBy.substring(1);
    return this.http
      .post<IGetEmployees>(
        `${this.apiUrl}/employees/`,
        transformedQueryParams,
        {
          withCredentials: true,
          headers: this.Headers,
        },
      )
      .pipe(
        map((res) => {
          return res;
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
