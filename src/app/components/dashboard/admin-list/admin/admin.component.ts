import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../../../../shared/models/employee.model';

@Component({
  selector: '[app-admin]',
  standalone: true,
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  @Input({ required: true }) admin!: Employee;
  @Input({ required: true }) sno!: number;
  @Output() updateAdmin = new EventEmitter<number>();
  @Output() deleteAdmin = new EventEmitter<number>();
  update() {
    this.updateAdmin.emit(this.admin.id);
  }
  delete() {
    this.deleteAdmin.emit(this.admin.id);
  }
}
