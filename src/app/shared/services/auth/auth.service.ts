import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import {
  AUTH_TOKEN,
  EMPLOYEE_TYPE,
  USER_ROLES,
  USER_ROLES_KEY,
} from '../../../utils/constants';
import { TEmployee } from '../../interfaces/employee.type';
import { ILoginRes } from '../../interfaces/login.interface';
import { ISignupPostData } from '../../interfaces/requests/signup.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.BASE_URL}`;
  private _userTypeSource = new BehaviorSubject<TEmployee | null>(
    localStorage.getItem(USER_ROLES_KEY) as TEmployee | null,
  );
  userTypeMessage$ = this._userTypeSource.asObservable();

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
    localStorage.removeItem(USER_ROLES_KEY);
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
          this._userTypeSource.next(
            (() => {
              const employee = (() => {
                const d = res.data.employeeType;
                if (d === EMPLOYEE_TYPE.employee) {
                  return USER_ROLES.Employee;
                } else if (d === EMPLOYEE_TYPE.admin) {
                  return USER_ROLES.Admin;
                } else {
                  return USER_ROLES.SuperAdmin;
                }
              })();
              localStorage.setItem(USER_ROLES_KEY, employee);
              return employee;
            })(),
          );
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
  changePassword(data: { newPassword: string }) {
    return this.http.post(`${this.apiUrl}/user/ChangePassword`, data, {
      headers: this.Headers,
    });
  }
}
