import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AUTH_TOKEN } from '../../../utils/constants';

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
    return this.http.get(`${this.apiUrl}/userDetails`, {
      withCredentials: true,
      headers: this.Headers,
    });
  }
  employees(page: number) {
    return this.http.get(`${this.apiUrl}/employees/${page}`, {
      withCredentials: true,
      headers: this.Headers,
    });
  }
  deleteEmployee(id: number) {
    return this.http.delete(`${this.apiUrl}/deleteEmployee/${id}`, {
      withCredentials: true,
      headers: this.Headers,
    });
  }
  updateEmployee(id: number) {}
}
