import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { LocalStorageKeys } from '../../../utils/constants';
import { IGetDepartmentRes } from '../../interfaces/requests/department.interface';
import { getLocalStorageItem } from '../../../utils/localStorageCRUD';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiUrl = `${environment.BASE_URL}`;
  constructor(private http: HttpClient) {}
  public get Headers() {
    const token = getLocalStorageItem(LocalStorageKeys.AuthToken);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
  public getDepartments() {
    return this.http
      .get<IGetDepartmentRes>(`${this.apiUrl}/departments`, {
        withCredentials: true,
        headers: this.Headers,
      })
      .pipe(map((res) => res.iterableData));
  }
  public deleteDepartment(id: number) {
    return this.http.delete(`${this.apiUrl}/deleteDepartment/${id}`, {
      withCredentials: true,
      headers: this.Headers,
    });
  }
  public createDepartment(data: { departmentName: string }) {
    return this.http.post(`${this.apiUrl}/addDepartment`, data, {
      withCredentials: true,
      headers: this.Headers,
    });
  }
  public updateDepartment() {
    return this.http.delete(`${this.apiUrl}`);
  }
}
