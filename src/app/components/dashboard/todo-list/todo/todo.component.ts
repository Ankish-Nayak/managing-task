import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HighlightDirective } from '../../../../shared/directives/highlight/highlight.directive';
import { ICONS } from '../../../../shared/icons/icons';
import { TEmployee } from '../../../../shared/interfaces/employee.type';
import { ConfirmationModalComponent } from '../../../../shared/modals/confirmation-modal/confirmation-modal.component';
import { Todo } from '../../../../shared/models/todo.model';
import { TodoService } from '../../../../shared/services/todo/todo.service';
import { USER_ROLES } from '../../../../utils/constants';
import { COLS, TCOLS, TcolsName } from '../cols';

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
export class TodoComponent {
  @Input({ required: true }) todo!: Todo;
  @Input({ required: true }) sno!: number;
  @Output() deleteTodo = new EventEmitter<number>();
  @Output() updateTodo = new EventEmitter<number>();
  @Output() navigateTo = new EventEmitter<number>();
  @Input({ required: true }) userType!: TEmployee;
  // @Output() markTodo = new EventEmitter<Todo>();

  highlight: { edit: boolean; delete: boolean } = {
    edit: false,
    delete: false,
  };
  cols: TCOLS = COLS;
  USER_ROLES = USER_ROLES;
  readonly ICONS = ICONS;

  constructor(private todoService: TodoService) {}
  delete() {
    this.deleteTodo.emit(this.todo.id);
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
    //TODO: api for todo is not there.
    this.todoService
      .updateTodo(this.todo.id, {
        ...this.todo,
        isCompleted: !this.todo.isCompleted,
      })
      .subscribe(() => {
        this.todo.isCompleted = !this.todo.isCompleted;
      });
    // this.markTodo.emit({ ...this.todo, isCompleted: !this.todo.isCompleted });
  }

  onHighlight(type: 'edit' | 'delete', binary: boolean) {
    if (type === 'edit') {
      this.highlight.edit = binary;
    } else {
      this.highlight.delete = binary;
    }
  }
}
