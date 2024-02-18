import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UpsertAdminComponent } from '../../../../components/dashboard/admin-list/upsert-admin/upsert-admin.component';
import { TodoDetailComponent } from '../../../../components/dashboard/todo-list/todo-detail/todo-detail.component';
import { UpsertTodoComponent } from '../../../../components/dashboard/upsert-todo/upsert-todo.component';
import { COMPONENT_NAME } from '../../../../utils/constants';

@Component({
  selector: 'app-upsert-content-modal',
  standalone: true,
  imports: [
    CommonModule,
    UpsertTodoComponent,
    UpsertAdminComponent,
    TodoDetailComponent,
  ],
  templateUrl: './upsert-content-modal.component.html',
  styleUrl: './upsert-content-modal.component.scss',
})
export class UpsertContentModalComponent {
  @Input() update!: boolean;
  @Input() id!: string;
  @Input({ required: true }) componentName!:
    | COMPONENT_NAME.UPSERT_ADMIN_COMPONENT
    | COMPONENT_NAME.UPSERT_TODO_COMPONENT
    | COMPONENT_NAME.TODO_DETAIL_COMPONENT;
  readonly COMPONENT_NAME = COMPONENT_NAME;
  @ViewChild(UpsertTodoComponent) upsertTodoComponent!: UpsertTodoComponent;
  @ViewChild(UpsertAdminComponent) upsertAdminComponent!: UpsertAdminComponent;
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
  getTitle() {
    if (this.componentName === COMPONENT_NAME.UPSERT_ADMIN_COMPONENT) {
      return this.update ? 'Admin Updation' : 'Admin Registration';
    } else if (this.componentName === COMPONENT_NAME.UPSERT_TODO_COMPONENT) {
      return !this.update ? 'Todo Creation' : 'Todo Updation';
    } else {
      return 'Todo';
    }
  }
  onReset() {
    if (this.componentName === COMPONENT_NAME.UPSERT_ADMIN_COMPONENT) {
      this.upsertAdminComponent.reset();
    } else if (this.componentName === COMPONENT_NAME.TODO_DETAIL_COMPONENT) {
      // null
    } else {
      this.upsertTodoComponent.reset();
    }
  }
  onEdit(binary: boolean) {
    if (binary) {
      this.componentName = COMPONENT_NAME.UPSERT_TODO_COMPONENT;
    }
  }
}
