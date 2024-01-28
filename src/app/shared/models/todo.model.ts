import { Injectable } from '@angular/core';
import { ITask } from '../interfaces/requests/toto.interface';
export class Todo {
  title: string;
  description: string;
  isCompleted: boolean;
  id: number;
  employeeId: number;
  assignBy: number;
  constructor(
    id: number,
    employeeId: number,
    assignBy: number,
    title: string,
    description: string,
    isCompleted: boolean,
  ) {
    this.id = id;
    this.employeeId = employeeId;
    this.assignBy = assignBy;
    this.isCompleted = isCompleted;
    this.description = description;
    this.title = title;
  }
}

@Injectable({
  providedIn: 'root',
})
export class TaskAdapter {
  constructor() {}

  adapt(item: any): ITask {
    return {
      title: item.title,
      description: item.description,
      isCompleted: item.isCompleted,
      id: item.id,
      employeeId: item.employeeId,
      assignBy: item.assignBy,
    };
  }

  adaptArray(items: any[]): ITask[] {
    return items.map((item) => this.adapt(item));
  }
}
