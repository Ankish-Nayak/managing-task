import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HighlightDirective } from '../../../../shared/directives/highlight.directive';
import { ICONS } from '../../../../shared/icons/icons';
import { Employee } from '../../../../shared/models/employee.model';

@Component({
  selector: '[app-employee]',
  standalone: true,
  imports: [HighlightDirective],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent {
  @Input({ required: true }) employee!: Employee;
  @Input({ required: true }) sno!: number;
  @Output() updateEmployee = new EventEmitter<number>();
  @Output() deleteEmployee = new EventEmitter<number>();
  highlight: boolean = false;
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

  onHightlight(binary: boolean) {
    this.highlight = binary;
  }
}
