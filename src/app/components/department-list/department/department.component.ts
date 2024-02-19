import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HighlightDirective } from '../../../shared/directives/highlight/highlight.directive';
import { ICONS } from '../../../shared/icons/icons';
import { TEmployee } from '../../../shared/interfaces/employee.type';
import { Department } from '../../../shared/models/department.model';
import { allowedToView } from '../../../utils/allowedToView';
import { UserRole } from '../../../utils/constants';

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
  readonly allowedToView = allowedToView;
  readonly ICONS = ICONS;
  readonly UserRole = UserRole;
  @Input({ required: true }) department!: Department;
  @Input({ required: true }) sNo!: number;
  @Input({ required: true }) userType!: TEmployee;
  @Output() updateDepartment = new EventEmitter<number>();
  @Output() deleteDepartment = new EventEmitter<number>();
  @Output() employeesByDepartment = new EventEmitter<number>();
  public highlight: { edit: boolean; delete: boolean; eye: boolean } = {
    edit: false,
    delete: false,
    eye: false,
  };
  public update(id: number) {
    this.updateDepartment.emit(id);
  }
  public delete(id: number) {
    this.deleteDepartment.emit(id);
  }
  public onHighlight(type: 'edit' | 'delete' | 'eye', binary: boolean) {
    this.highlight[type] = binary;
  }
  public onEye(id: number) {
    this.employeesByDepartment.emit(id);
  }
}
