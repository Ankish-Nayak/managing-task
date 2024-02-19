import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import {
  EMPLOYEE_TYPE,
  LocalStorageKeys,
  UserRole,
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
    getLocalStorageItem(LocalStorageKeys.UserRole) as UserRole | null,
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
  public userMessageSource = this._userSource.asObservable();
  public userTypeMessage$ = this._userTypeSource.asObservable();

  constructor(private http: HttpClient) {}
  public get Headers() {
    const token = getLocalStorageItem(LocalStorageKeys.AuthToken);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  public me() {
    const token = getLocalStorageItem(LocalStorageKeys.AuthToken);
    return token === null ? false : true;
  }
  public profile() {
    return this.http
      .get<IGetProfile>(`${this.apiUrl}/userDetails`, {
        withCredentials: true,
        headers: this.Headers,
      })
      .pipe(map((res) => res.data));
  }

  public updateProfile(id: number, data: IEmployee) {
    return this.http.put(`${this.apiUrl}/updateuser/${id}`, data, {
      withCredentials: true,
      headers: this.Headers,
    });
  }
  public logout() {
    Object.values(LocalStorageKeys).forEach((v) => {
      removeLocalStorageItem(v);
    });
    return of();
  }
  public login(email: string, password: string) {
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
              setLocalStorageItem(LocalStorageKeys.UserRole, employee);
              return employee;
            })(),
          );
          this._userSource.next(res.data as Employee);
          setLocalStorageItem(LocalStorageKeys.User, JSON.stringify(res.data));
          return res.data;
        }),
      );
  }
  public signup(data: ISignupPostData) {
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
  public changePassword(data: { newPassword: string }) {
    return this.http.post(`${this.apiUrl}/user/ChangePassword`, data, {
      headers: this.Headers,
    });
  }
  public set userTypeSource(value: number) {
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
    setLocalStorageItem(LocalStorageKeys.UserRole, employee);
  }
}
