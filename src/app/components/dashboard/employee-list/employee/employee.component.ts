import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HighlightDirective } from '../../../../shared/directives/highlight/highlight.directive';
import { ICONS } from '../../../../shared/icons/icons';
import { Employee } from '../../../../shared/models/employee.model';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: '[app-employee]',
  standalone: true,
  imports: [HighlightDirective, NgbTooltipModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent {
  @Input({ required: true }) employee!: Employee;
  @Input({ required: true }) sno!: number;
  @Output() updateEmployee = new EventEmitter<number>();
  @Output() deleteEmployee = new EventEmitter<number>();
  @Output() viewEmployeeByDepartment = new EventEmitter<number>();
  highlight: {
    eye: boolean;
    delete: boolean;
  } = {
    eye: false,
    delete: false,
  };
  readonly ICONS = ICONS;
  update() {
    localStorage.setItem(
      `employee/${this.employee.id}`,
      JSON.stringify(this.employee),
    );
    this.updateEmployee.emit(this.employee.id);
  }
  delete() {
    this.deleteEmployee.emit(this.employee.id);
  }

  onHightlight(type: 'delete' | 'eye', binary: boolean) {
    this.highlight[type] = binary;
  }
  onViewEmployeeByDepartment() {
    this.viewEmployeeByDepartment.emit(this.employee.id);
    console.log(this.employee.id);
  }
}
