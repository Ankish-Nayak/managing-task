import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import {
  AUTH_TOKEN,
  EMPLOYEE_TYPE,
  USER_KEY,
  USER_ROLES,
  USER_ROLES_KEY,
} from '../../../utils/constants';
// import { USER_ROLES } from '../../interfaces/employee.type';
import { ILoginRes } from '../../interfaces/login.interface';
import { IGetProfile } from '../../interfaces/requests/auth.interface';
import { ISignupPostData } from '../../interfaces/requests/signup.interface';
import { Employee } from '../../models/employee.model';
import { IEmployee } from '../../interfaces/requests/employee.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.BASE_URL}`;
  private _userTypeSource = new BehaviorSubject<USER_ROLES | null>(
    localStorage.getItem(USER_ROLES_KEY) as USER_ROLES | null,
  );
  private _userSource = new BehaviorSubject<Employee | null>(
    (() => {
      const data = localStorage.getItem(USER_KEY);
      if (data === null) {
        return null;
      } else {
        return JSON.parse(data) as Employee;
      }
    })(),
  );
  userMessageSource = this._userSource.asObservable();
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
  profile() {
    return this.http
      .get<IGetProfile>(`${this.apiUrl}/userDetails`, {
        withCredentials: true,
        headers: this.Headers,
      })
      .pipe(map((res) => res.data));
  }

  updateProfile(id: number, data: IEmployee) {
    console.log(data);
    return this.http.put(`${this.apiUrl}/updateuser/${id}`, data, {
      withCredentials: true,
      headers: this.Headers,
    });
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
    return this.http.post(
      `${this.apiUrl}/registration`,
      {
        id: 0, // cuz of incapability of backend dev
        ...data,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
  changePassword(data: { newPassword: string }) {
    return this.http.post(`${this.apiUrl}/user/ChangePassword`, data, {
      headers: this.Headers,
    });
  }
  set userTypeSource(value: number) {
    const employee = (() => {
      const d = value;
      if (d === EMPLOYEE_TYPE.employee) {
        return USER_ROLES.Employee;
      } else if (d === EMPLOYEE_TYPE.admin) {
        return USER_ROLES.Admin;
      } else {
        return USER_ROLES.SuperAdmin;
      }
    })();
    localStorage.setItem(USER_ROLES_KEY, employee);
  }
}
