import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import {
  EMPLOYEE_TYPE,
  LocalStorageKeys,
  UserRole,
  UserRole_KEY,
} from '../../../utils/constants';
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '../../../utils/localStorageCRUD';
import { ILoginRes } from '../../interfaces/login.interface';
import { IGetProfile } from '../../interfaces/requests/auth.interface';
import { IEmployee } from '../../interfaces/requests/employee.interface';
import { ISignupPostData } from '../../interfaces/requests/signup.interface';
import { Employee } from '../../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.BASE_URL}`;
  private _userTypeSource = new BehaviorSubject<UserRole | null>(
    localStorage.getItem(UserRole_KEY) as UserRole | null,
  );
  private _userSource = new BehaviorSubject<Employee | null>(
    (() => {
      const data = getLocalStorageItem(LocalStorageKeys.User);
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
    const token = getLocalStorageItem(LocalStorageKeys.AuthToken);
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
    const token = getLocalStorageItem(LocalStorageKeys.AuthToken);
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
    return this.http.put(`${this.apiUrl}/updateuser/${id}`, data, {
      withCredentials: true,
      headers: this.Headers,
    });
  }
  logout() {
    removeLocalStorageItem(LocalStorageKeys.AuthToken);
    localStorage.removeItem(UserRole_KEY);
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
          setLocalStorageItem(LocalStorageKeys.AuthToken, res.token);
          this._userTypeSource.next(
            (() => {
              const employee = (() => {
                const d = res.data.employeeType;
                if (d === EMPLOYEE_TYPE.employee) {
                  return UserRole.Employee;
                } else if (d === EMPLOYEE_TYPE.admin) {
                  return UserRole.Admin;
                } else {
                  return UserRole.SuperAdmin;
                }
              })();
              localStorage.setItem(UserRole_KEY, employee);
              return employee;
            })(),
          );
          return res.data;
        }),
      );
  }
  signup(data: ISignupPostData) {
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
        return UserRole.Employee;
      } else if (d === EMPLOYEE_TYPE.admin) {
        return UserRole.Admin;
      } else {
        return UserRole.SuperAdmin;
      }
    })();
    localStorage.setItem(UserRole_KEY, employee);
  }
}
