import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationModalComponent } from '../../../../shared/modals/confirmation-modal/confirmation-modal.component';
import { Todo } from '../../../../shared/models/todo.model';

@Component({
  selector: '[app-todo]',
  standalone: true,
  imports: [CommonModule, ConfirmationModalComponent],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  @Input({ required: true }) todo!: Todo;
  @Input({ required: true }) sno!: number;
  @Output() deleteTodo = new EventEmitter<number>();
  @Output() updateTodo = new EventEmitter<number>();
  constructor() {}
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
  getModalName() {
    return `todoDeleteConfirmation|${this.todo.id}`;
  }
}
