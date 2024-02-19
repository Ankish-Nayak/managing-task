import { Injectable } from '@angular/core';

import { Adapter } from './adapter';
import { IDepartment } from '../interfaces/requests/department.interface';

export class Department implements IDepartment {
  public id: number;
  public departmentName: string;
  public employeesCount: number;
  constructor(id: number, name: string, employeesCount: number) {
    this.id = id;
    this.departmentName = name;
    this.employeesCount = employeesCount;
  }
}

@Injectable({
  providedIn: 'root',
})
export class DepartmentAdapter implements Adapter<Department> {
  public adapt(department: IDepartment) {
    return new Department(
      department.id,
      department.departmentName,
      department.employeesCount,
    );
  }
  public adaptArray(departments: IDepartment[]) {
    return departments.map((department) => this.adapt(department));
  }
}
