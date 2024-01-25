import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import { AUTH_TOKEN } from '../../../utils/constants';
import { ILoginRes } from '../../interfaces/login.interface';
import { of } from 'rxjs';
import { ISignupPostData } from '../../interfaces/requests/signup.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.BASE_URL}`;
  constructor(private http: HttpClient) {}
  get Headers() {
    const token = localStorage.getItem(AUTH_TOKEN);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
  getHeaders() {
    //TODO: handle headers here.
    //
  }

  me() {
    //TODO: make it observable for backend request.
    const token = localStorage.getItem(AUTH_TOKEN);
    return token === null ? false : true;
  }

  logout() {
    localStorage.removeItem(AUTH_TOKEN);
    return of();
  }
  login(email: string, password: string) {
    return this.http
      .post<ILoginRes>(
        `${this.apiUrl}/user/login`,
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .pipe(
        map((res) => {
          localStorage.setItem(AUTH_TOKEN, res.token);
          return res.data;
        }),
      );
  }
  signup(data: ISignupPostData) {
    console.log(data);
    return this.http.post(`${this.apiUrl}/registration`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
