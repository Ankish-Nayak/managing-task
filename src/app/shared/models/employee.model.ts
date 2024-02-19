import { Injectable } from '@angular/core';
import { IEmployee } from '../interfaces/requests/employee.interface';
import { Adapter } from './adapter';

export class Employee implements IEmployee {
  public id: number;
  public name: string;
  public email: string;
  public employeeType: number;
  public address: string;
  public city: string;
  public country: string;
  public phone: string;
  public departmentID: number;
  public departmentName: string;
  public createdAt: string;
  public updatedAt: string;

  constructor(
    id: number,
    name: string,
    email: string,
    employeeType: number,
    address: string,
    city: string,
    country: string,
    phone: string,
    departmentID: number,
    departmentName: string,
    createdAt: string,
    updatedAt: string,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.employeeType = employeeType;
    this.address = address;
    this.city = city;
    this.country = country;
    this.phone = phone;
    this.departmentID = departmentID;
    this.departmentName = departmentName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeAdapter implements Adapter<Employee> {
  public adapt(item: IEmployee): Employee {
    return new Employee(
      item.id,
      item.name,
      item.email,
      item.employeeType,
      item.address,
      item.city,
      item.country,
      item.phone,
      item.departmentID,
      item.departmentName,
      item.createdAt,
      item.updatedAt,
    );
  }

  public adaptArray(items: IEmployee[]): Employee[] {
    return items.map((item) => this.adapt(item));
  }
}
