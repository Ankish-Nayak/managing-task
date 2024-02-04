import { Injectable } from '@angular/core';
import { IEmployee } from '../interfaces/requests/employee.interface';
import { Adapter } from './adapter';

export class Employee implements IEmployee {
  id: number;
  name: string;
  email: string;
  employeeType: number;
  address: string;
  city: string;
  country: string;
  phone: string;
  departmentID: number;
  departmentName: string;
  createdAt: string;
  updatedAt: string;

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
  adapt(item: IEmployee): Employee {
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

  adaptArray(items: IEmployee[]): Employee[] {
    return items.map((item) => this.adapt(item));
  }
}
