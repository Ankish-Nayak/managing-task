import { Injectable } from '@angular/core';

import { Adapter } from './adapter';
import { IDepartment } from '../interfaces/requests/department.interface';

export class Department {
  id: number;
  name: string;
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

@Injectable({
  providedIn: 'root',
})
export class DepartmentAdapter implements Adapter<Department> {
  adapt(department: IDepartment) {
    return new Department(department.id, department.departmentName);
  }
  adaptArray(departments: IDepartment[]) {
    return departments.map((department) => this.adapt(department));
  }
}
