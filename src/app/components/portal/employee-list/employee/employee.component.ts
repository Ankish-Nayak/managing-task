import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HighlightDirective } from '../../../../shared/directives/highlight/highlight.directive';
import { ICONS } from '../../../../shared/icons/icons';
import { Employee } from '../../../../shared/models/employee.model';
import { ChatboxService } from '../../../../shared/services/chatbox/chatbox.service';
import { EMPLOYEE_TYPE } from '../../../../utils/constants';

@Component({
  selector: '[app-employee]',
  standalone: true,
  imports: [HighlightDirective, NgbTooltipModule, CommonModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent {
  @Input({ required: true }) employee!: Employee;
  @Input({ required: true }) sno!: number;
  @Output() updateEmployee = new EventEmitter<number>();
  @Output() deleteEmployee = new EventEmitter<number>();
  @Output() viewEmployeeByDepartment = new EventEmitter<number>();
  @Output() assignTask = new EventEmitter<number>();
  public highlight: {
    eye: boolean;
    delete: boolean;
  } = {
    eye: false,
    delete: false,
  };
  readonly ICONS = ICONS;
  readonly EMPLOYEE_TYPE = EMPLOYEE_TYPE;
  constructor(private chatBoxService: ChatboxService) {}
  public update() {
    localStorage.setItem(
      `employee/${this.employee.id}`,
      JSON.stringify(this.employee),
    );
    this.updateEmployee.emit(this.employee.id);
  }
  public delete() {
    this.deleteEmployee.emit(this.employee.id);
  }

  public onHightlight(type: 'delete' | 'eye', binary: boolean) {
    this.highlight[type] = binary;
  }
  public onViewEmployeeByDepartment() {
    this.viewEmployeeByDepartment.emit(this.employee.id);
    console.log(this.employee.id);
  }
  public assinTask() {
    this.assignTask.emit(this.employee.id);
  }
  public onChatWith() {
    this.chatBoxService.addChatTab({
      id: this.employee.id,
      name: this.employee.name,
    });
  }
  public createQueryParamsString(queryParams: any): string {
    return Object.keys(queryParams)
      .map((key) => `${key}=${queryParams[key]}`)
      .join('&');
  }
}
