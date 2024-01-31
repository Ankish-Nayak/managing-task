import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Department } from '../../../shared/models/department.model';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TEmployee } from '../../../shared/interfaces/employee.type';
import { allowedToView } from '../../../utils/allowedToView';
import { USER_ROLES } from '../../../utils/constants';
import { ICONS } from '../../../shared/icons/icons';
import { HighlightDirective } from '../../../shared/directives/highlight/highlight.directive';

@Component({
  selector: '[app-department]',
  standalone: true,
  imports: [
    CommonModule,
    NgbTooltipModule,
    HighlightDirective,
    NgbTooltipModule,
  ],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss',
})
export class DepartmentComponent {
  @Input({ required: true }) department!: Department;
  @Input({ required: true }) sNo!: number;
  @Output() updateDepartment = new EventEmitter<number>();
  @Output() deleteDepartment = new EventEmitter<number>();
  @Output() employeesByDepartment = new EventEmitter<number>();
  @Input({ required: true }) userType!: TEmployee;
  readonly allowedToView = allowedToView;
  readonly ICONS = ICONS;
  readonly USER_ROLES = USER_ROLES;

  highlight: { edit: boolean; delete: boolean } = {
    edit: false,
    delete: false,
  };
  update(id: number) {
    this.updateDepartment.emit(id);
  }
  delete(id: number) {
    this.deleteDepartment.emit(id);
  }
  onHighlight(type: 'edit' | 'delete', binary: boolean) {
    this.highlight[type] = binary;
  }
}
