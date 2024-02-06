import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import { AUTH_TOKEN } from '../../../utils/constants';
import {
  GetTodosQueryParams,
  ICreateTodoPostData,
  IGetTodosQueryParams,
  IGetTodosRes,
  IMarkTodoPostData,
  IUpdateTodoPostData,
} from '../../interfaces/requests/toto.interface';

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
  getTodos(queryParams: Partial<IGetTodosQueryParams>) {
    const transformedQueryParams = new GetTodosQueryParams(queryParams);
    transformedQueryParams.orderBy =
      transformedQueryParams.orderBy.charAt(0).toUpperCase() +
      transformedQueryParams.orderBy.substring(1);
    return this.http
      .post<IGetTodosRes>(`${this.apiUrl}/tasks`, transformedQueryParams, {
        headers: this.Headers,
      })
      .pipe(
        map((res) => {
          return {
            iterableData: res.iterableData,
            totalPageCount: res.count,
          };
        }),
      );
  }
  updateTodo(todoId: number, data: IUpdateTodoPostData) {
    return this.http.put(`${this.apiUrl}/update/${todoId}`, data, {
      withCredentials: true,
      headers: this.Headers,
    });
  }
  createTodo(data: ICreateTodoPostData) {
    return this.http.post(`${this.apiUrl}/add`, data, {
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
  markTodo(id: number, data: IMarkTodoPostData) {
    return this.http.post(`${this.apiUrl}/SetTodoCompleted/${id}`, data, {
      withCredentials: true,
      headers: this.Headers,
    });
  }
}
