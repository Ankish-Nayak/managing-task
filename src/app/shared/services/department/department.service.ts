import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { AUTH_TOKEN } from '../../../utils/constants';
import { IGetDepartmentRes } from '../../interfaces/requests/department.interface';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiUrl = `${environment.BASE_URL}`;
  constructor(private http: HttpClient) {}
  get Headers() {
    const token = localStorage.getItem(AUTH_TOKEN);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
  getDepartments() {
    return this.http
      .get<IGetDepartmentRes>(`${this.apiUrl}/departments`, {
        withCredentials: true,
        headers: this.Headers,
      })
      .pipe(map((res) => res.iterableData));
  }
  deleteDepartment(id: number) {
    return this.http.delete(`${this.apiUrl}/deleteDepartment/${id}`, {
      withCredentials: true,
      headers: this.Headers,
    });
  }
  createDepartment(data: { departmentName: string }) {
    return this.http.post(`${this.apiUrl}/addDepartment`, data, {
      withCredentials: true,
      headers: this.Headers,
    });
  }
  updateDepartment() {
    return this.http.delete(`${this.apiUrl}`);
  }
}
