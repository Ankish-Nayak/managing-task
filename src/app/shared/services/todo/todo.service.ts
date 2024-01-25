import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import { AUTH_TOKEN } from '../../../utils/constants';
import { IGetTodosRes } from '../../interfaces/requests/toto.interface';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = `${environment.BASE_URL}/todo`;
  constructor(private http: HttpClient) {}
  get Headers() {
    const token = localStorage.getItem(AUTH_TOKEN);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
  getTodos() {
    return this.http
      .get<IGetTodosRes>(`${this.apiUrl}/tasks/1`, {
        headers: this.Headers,
      })
      .pipe(
        map((res) => {
          console.log(res);
          return res.iterableData;
        }),
      );
  }
  updateTodo(
    todoId: number,
    data: {
      title: string;
      description: string;
      isCompleted: boolean;
    },
  ) {
    return this.http.put(`${this.apiUrl}/update/${todoId}`, data, {
      withCredentials: true,
      headers: this.Headers,
    });
  }
  createTodo(
    employeeId: number,
    data: {
      title: string;
      description: string;
      isCompleted: boolean;
    },
  ) {
    return this.http.post(`${this.apiUrl}/add/${employeeId}`, data, {
      withCredentials: true,
      headers: this.Headers,
    });
  }
  deleteTodo(id: number) {
    return this.http.delete(`${this.apiUrl}/remove/${id}`, {
      withCredentials: true,
      headers: this.Headers,
    });
  }
  getTodo(id: string) {
    //TODO: make backend request to get particular todo.
    //
    return localStorage.getItem(`todo/${id}`)!;
  }
}
