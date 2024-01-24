import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AUTH_TOKEN } from '../../../utils/constants';
import { IGetDepartmentRes } from '../../interfaces/requests/department.interface';
import { map } from 'rxjs';

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
}
