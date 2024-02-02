import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TEmployee } from '../../../../shared/interfaces/employee.type';
import { GetTodosQueryParams } from '../../../../shared/interfaces/requests/toto.interface';
import { TodoPaginationComponent } from '../todo-pagination/todo-pagination.component';

@Component({
  selector: '[app-todo-list-controller]',
  standalone: true,
  imports: [CommonModule, TodoPaginationComponent, FormsModule],
  templateUrl: './todo-list-controller.component.html',
  styleUrl: './todo-list-controller.component.scss',
})
export class TodoListControllerComponent implements OnInit {
  @Input() isLoading: boolean = false;
  @Input({ required: true }) pageState!: GetTodosQueryParams;
  @Input({ required: true }) userType!: TEmployee;
  @Output() assignTask: EventEmitter<void> = new EventEmitter();
  @Output() pageStateChange: EventEmitter<Partial<GetTodosQueryParams>> =
    new EventEmitter<Partial<GetTodosQueryParams>>();
  searchBox: string = '';
  isSearchBoxDisabled: boolean = true;
  placeholder: string = 'Search todos here';
  @Input({ required: true }) totalPagesCount!: number;
  ngOnInit(): void {}
  assignTo() {
    this.assignTask.emit();
  }
  onPageChange(pageStateUpdate: Partial<GetTodosQueryParams>) {
    this.pageStateChange.emit(pageStateUpdate);
  }
  onSearch(e?: KeyboardEvent) {
    if (!e || (e && e.key === 'Enter')) {
      this.pageStateChange.emit({ search: this.searchBox });
    }
  }
}
