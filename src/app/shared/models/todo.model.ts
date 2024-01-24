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
