import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../../../../shared/models/employee.model';
import { TEmployee } from '../../../../shared/interfaces/employee.type';
import { allowedToView } from '../../../../utils/allowedToView';
import { CommonModule } from '@angular/common';
import { USER_ROLES } from '../../../../utils/constants';
import { HighlightDirective } from '../../../../shared/directives/highlight/highlight.directive';
import { ICONS } from '../../../../shared/icons/icons';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: '[app-admin]',
  standalone: true,
  imports: [CommonModule, HighlightDirective, NgbTooltipModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  @Input({ required: true }) admin!: Employee;
  @Input({ required: true }) sno!: number;
  @Output() updateAdmin = new EventEmitter<number>();
  @Output() deleteAdmin = new EventEmitter<number>();
  @Input({ required: true }) userType!: TEmployee;
  readonly allowedToView = allowedToView;
  readonly USER_ROLES = USER_ROLES;
  readonly ICONS = ICONS;

  highlight: { edit: boolean; delete: boolean } = {
    edit: false,
    delete: false,
  };
  update() {
    localStorage.setItem(
      `employee/${this.admin.id}`,
      JSON.stringify(this.admin),
    );
    this.updateAdmin.emit(this.admin.id);
  }
  delete() {
    this.deleteAdmin.emit(this.admin.id);
  }
  onHighlight(type: 'edit' | 'delete', binary: boolean) {
    this.highlight[type] = binary;
  }
}
