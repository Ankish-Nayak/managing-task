import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import { LocalStorageKeys } from '../../../utils/constants';
import {
  GetTodosQueryParams,
  ICreateTodoPostData,
  IGetTodosQueryParams,
  IGetTodosRes,
  IMarkTodoPostData,
  IUpdateTodoPostData,
} from '../../interfaces/requests/todo.interface';
import { getLocalStorageItem } from '../../../utils/localStorageCRUD';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = `${environment.BASE_URL}/todo`;
  constructor(private http: HttpClient) {}
  public get Headers() {
    const token = getLocalStorageItem(LocalStorageKeys.AuthToken);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
  public getTodos(queryParams: Partial<IGetTodosQueryParams>) {
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
  public updateTodo(todoId: number, data: IUpdateTodoPostData) {
    return this.http.put(`${this.apiUrl}/update/${todoId}`, data, {
      withCredentials: true,
      headers: this.Headers,
    });
  }
  public createTodo(data: ICreateTodoPostData) {
    return this.http.post(`${this.apiUrl}/add`, data, {
      withCredentials: true,
      headers: this.Headers,
    });
  }
  public deleteTodo(id: number) {
    return this.http.delete(`${this.apiUrl}/remove/${id}`, {
      withCredentials: true,
      headers: this.Headers,
    });
  }
  public getTodo(id: string) {
    return localStorage.getItem(`todo/${id}`)!;
  }
  public markTodo(id: number, data: IMarkTodoPostData) {
    return this.http.post(`${this.apiUrl}/SetTodoCompleted/${id}`, data, {
      withCredentials: true,
      headers: this.Headers,
    });
  }
}
