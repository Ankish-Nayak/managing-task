import { Injectable } from '@angular/core';
import { ITask } from '../interfaces/requests/todo.interface';
export class Todo implements ITask {
  title: string;
  description: string;
  isCompleted: boolean;
  employeeId: number;
  id: number;
  departmentId: number;
  employeeName: string;
  departmentName: string;
  assignBy: number;
  createdDate: string;
  updatedDate: string;
  deadLine: null | string;
  constructor(data: ITask) {
    this.title = data.title;
    this.description = data.description;
    this.isCompleted = data.isCompleted;
    this.employeeId = data.employeeId;
    this.id = data.id;
    this.departmentId = data.departmentId;
    this.employeeName = data.employeeName;
    this.departmentName = data.departmentName;
    this.assignBy = data.assignBy;
    this.createdDate = data.createdDate;
    this.updatedDate = data.updatedDate;
    this.deadLine = data.deadLine;
  }
}

@Injectable({
  providedIn: 'root',
})
export class TaskAdapter {
  constructor() {}

  adapt(item: ITask): Todo {
    return {
      title: item.title,
      description: item.description,
      isCompleted: item.isCompleted,
      employeeId: item.employeeId,
      id: item.id,
      departmentId: item.departmentId,
      employeeName: item.employeeName,
      departmentName: item.departmentName,
      assignBy: item.assignBy,
      createdDate: item.createdDate,
      updatedDate: item.updatedDate,
      deadLine: item.deadLine,
    };
  }

  adaptArray(items: any[]): Todo[] {
    return items.map((item) => this.adapt(item));
  }
}
