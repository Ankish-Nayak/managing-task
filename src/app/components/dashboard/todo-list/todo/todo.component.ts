import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HighlightDirective } from '../../../../shared/directives/highlight/highlight.directive';
import { ICONS } from '../../../../shared/icons/icons';
import { TEmployee } from '../../../../shared/interfaces/employee.type';
import { ConfirmationModalComponent } from '../../../../shared/modals/confirmation-modal/confirmation-modal.component';
import { Todo } from '../../../../shared/models/todo.model';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { TodoService } from '../../../../shared/services/todo/todo.service';
import { UserRole } from '../../../../utils/constants';
import { COLS, TCOLS, TcolsName } from '../cols';
import { TodoTab } from '../todo-list.component';

@Component({
  selector: '[app-todo]',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ConfirmationModalComponent,
    NgbTooltipModule,
    HighlightDirective,
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent implements OnInit {
  todoMarkLoading = false;
  @Input({ required: true }) todo!: Todo;
  @Input({ required: true }) sno!: number;
  @Output() deleteTodo = new EventEmitter<number>();
  @Output() updateTodo = new EventEmitter<number>();
  @Output() navigateTo = new EventEmitter<number>();
  @Input({ required: true }) userType!: TEmployee;
  @Input({ required: true }) isLoading!: boolean;
  @Input({ required: true }) todoTab!: TodoTab;
  readonly TodoTab = TodoTab;
  highlight: { edit: boolean; delete: boolean } = {
    edit: false,
    delete: false,
  };
  cols: TCOLS = COLS;
  UserRole = UserRole;
  readonly ICONS = ICONS;

  constructor(
    private todoService: TodoService,
    private toastService: ToastService,
  ) {}
  delete() {
    this.deleteTodo.emit(this.todo.id);
  }
  ngOnInit(): void {
    // console.log(this.isLoading);
  }
  getDescription(description: string) {
    return description.length > 115
      ? description.substring(0, 115) + '...'
      : description;
  }
  update() {
    localStorage.setItem(`todo/${this.todo.id}`, JSON.stringify(this.todo));
    this.updateTodo.emit(this.todo.id);
  }
  navigate() {
    localStorage.setItem(`todo/${this.todo.id}`, JSON.stringify(this.todo));
    this.navigateTo.emit(this.todo.id);
  }
  userAllowedToView(colName: TcolsName) {
    const col = this.cols.find((e) => e.name === colName);
    return (
      col !== undefined &&
      (col.notAllowedUsers === null ||
        (col.notAllowedUsers !== null &&
          !col.notAllowedUsers.includes(this.userType)))
    );
  }
  allowedToView(allowedUsers: TEmployee[]) {
    return allowedUsers.includes(this.userType);
  }
  mark() {
    this.todoMarkLoading = true;
    this.todoService.markTodo(this.todo.id).subscribe((res) => {
      this.toastService.show('Todo', 'Todo marked as done', 'success', 2000);
      this.todoMarkLoading = false;
      this.todo = {
        ...this.todo,
        isCompleted: !this.todo.isCompleted,
      };
    });
  }

  onHighlight(type: 'edit' | 'delete', binary: boolean) {
    if (type === 'edit') {
      this.highlight.edit = binary;
    } else {
      this.highlight.delete = binary;
    }
  }
}
