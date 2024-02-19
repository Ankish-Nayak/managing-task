import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HighlightDirective } from '../../../../shared/directives/highlight/highlight.directive';
import { ICONS } from '../../../../shared/icons/icons';
import { TEmployee } from '../../../../shared/interfaces/employee.type';
import { Employee } from '../../../../shared/models/employee.model';
import { allowedToView } from '../../../../utils/allowedToView';
import { UserRole } from '../../../../utils/constants';

@Component({
  selector: '[app-admin]',
  standalone: true,
  imports: [CommonModule, HighlightDirective, NgbTooltipModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  readonly allowedToView = allowedToView;
  readonly UserRole = UserRole;
  readonly ICONS = ICONS;
  @Input({ required: true }) admin!: Employee;
  @Input({ required: true }) sno!: number;
  @Input({ required: true }) userType!: TEmployee;
  @Output() updateAdmin = new EventEmitter<number>();
  @Output() deleteAdmin = new EventEmitter<number>();
  public highlight: { edit: boolean; delete: boolean } = {
    edit: false,
    delete: false,
  };
  public update() {
    localStorage.setItem(
      `employee/${this.admin.id}`,
      JSON.stringify(this.admin),
    );
    this.updateAdmin.emit(this.admin.id);
  }
  public delete() {
    this.deleteAdmin.emit(this.admin.id);
  }
  public onHighlight(type: 'edit' | 'delete', binary: boolean) {
    this.highlight[type] = binary;
  }
}
