import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TEmployee } from '../../../../shared/interfaces/employee.type';
import { GetTodosQueryParams } from '../../../../shared/interfaces/requests/toto.interface';
import { Todo } from '../../../../shared/models/todo.model';
import { USER_ROLES } from '../../../../utils/constants';
import { TodoPaginationComponent } from '../todo-pagination/todo-pagination.component';

@Component({
  selector: '[app-todo-list-controller]',
  standalone: true,
  imports: [CommonModule, TodoPaginationComponent, FormsModule],
  templateUrl: './todo-list-controller.component.html',
  styleUrl: './todo-list-controller.component.scss',
})
export class TodoListControllerComponent {
  @Input({ required: true }) pageState!: GetTodosQueryParams;
  @Input({ required: true }) searchByCols!: { name: keyof Todo }[];
  @Input({ required: true }) userType!: TEmployee;
  @Output() assignTask: EventEmitter<void> = new EventEmitter();
  @Output() pageStateChange: EventEmitter<Partial<GetTodosQueryParams>> =
    new EventEmitter<Partial<GetTodosQueryParams>>();
  readonly USER_ROLES = USER_ROLES;
  selectedOption: keyof Todo | null = null;
  searchBox: string = '';
  isSearchBoxDisabled: boolean = true;
  placeholder: string = 'Select column to search';
  @Input({ required: true }) totalPagesCount!: number;
  assignTo() {
    this.assignTask.emit();
  }
  onPageChange(pageStateUpdate: Partial<GetTodosQueryParams>) {
    this.pageStateChange.emit(pageStateUpdate);
  }
  onSelectionChange() {
    console.log('selected Option', this.selectedOption);
    if (
      this.selectedOption === null ||
      this.selectedOption.toString() === 'null'
    ) {
      console.log('d');
      this.isSearchBoxDisabled = true;
      this.placeholder = 'Select column to search';
    } else {
      this.isSearchBoxDisabled = false;
      this.placeholder = 'Search using ' + this.selectedOption;
    }
  }
  onSearchBoxChange() {
    if (this.selectedOption) {
      this.pageState = {
        ...this.pageState,
        orderBy: this.selectedOption,
        search: this.searchBox,
      };
      this.pageStateChange.emit({
        orderBy: this.selectedOption,
        search: this.searchBox,
      });
    }
  }
}
