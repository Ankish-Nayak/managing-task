import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UpsertTodoComponent } from '../../../components/dashboard/upsert-todo/upsert-todo.component';
import { UpsertAdminComponent } from '../../../components/dashboard/admin-list/upsert-admin/upsert-admin.component';
import { COMPONENT_NAME } from '../../../utils/constants';

@Component({
  selector: 'app-upsert-content-modal',
  standalone: true,
  imports: [CommonModule, UpsertTodoComponent, UpsertAdminComponent],
  templateUrl: './upsert-content-modal.component.html',
  styleUrl: './upsert-content-modal.component.scss',
})
export class UpsertContentModalComponent {
  @Input() update!: boolean;
  @Input() id!: string;
  // @ViewChild(UpsertTodoComponent) childComponent!: UpsertTodoComponent;
  @Input({ required: true }) componentName!:
    | COMPONENT_NAME.UPSERT_ADMIN_COMPONENT
    | COMPONENT_NAME.UPSERT_TODO_COMPONENT;
  readonly COMPONENT_NAME = COMPONENT_NAME;
  constructor(private modal: NgbActiveModal) {}
  ngOnInit(): void {
    console.log(this.update, this.id);
  }
  closeModal() {
    this.modal.close();
  }
  dismissModal() {
    this.modal.dismiss();
  }
  onReset() {
    // this.childComponent.reset();
  }
}
