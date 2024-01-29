import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Department } from '../../../shared/models/department.model';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: '[app-department]',
  standalone: true,
  imports: [CommonModule, NgbTooltipModule],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss',
})
export class DepartmentComponent {
  @Input({ required: true }) department!: Department;
  @Input({ required: true }) sNo!: number;
  @Output() updateDepartment = new EventEmitter<number>();
  @Output() deleteDepartment = new EventEmitter<number>();
  @Output() employeesByDepartment = new EventEmitter<number>();
  update(id: number) {
    this.updateDepartment.emit(id);
  }
  delete(id: number) {
    this.deleteDepartment.emit(id);
  }
}
