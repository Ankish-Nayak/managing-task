import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TEmployee } from '../../../../shared/interfaces/employee.type';
import { GetTodosQueryParams } from '../../../../shared/interfaces/requests/toto.interface';
import { Todo } from '../../../../shared/models/todo.model';
import { TodoPaginationComponent } from '../todo-pagination/todo-pagination.component';

@Component({
  selector: '[app-todo-list-controller]',
  standalone: true,
  imports: [CommonModule, TodoPaginationComponent, FormsModule],
  templateUrl: './todo-list-controller.component.html',
  styleUrl: './todo-list-controller.component.scss',
})
export class TodoListControllerComponent implements OnInit {
  @Input({ required: true }) pageState!: GetTodosQueryParams;
  @Input({ required: true }) searchByCols!: { name: keyof Todo }[];
  @Input({ required: true }) userType!: TEmployee;
  @Output() assignTask: EventEmitter<void> = new EventEmitter();
  @Output() pageStateChange: EventEmitter<Partial<GetTodosQueryParams>> =
    new EventEmitter<Partial<GetTodosQueryParams>>();
  selectedPageSize: number = 0;
  searchBox: string = '';
  isSearchBoxDisabled: boolean = true;
  paginatedSizes: number[] = [];
  placeholder: string = 'Search todos here';
  @Input({ required: true }) totalPagesCount!: number;
  ngOnInit(): void {
    this.selectedPageSize = this.pageState.take;
    this.configurePaginatedSize();
  }
  assignTo() {
    this.assignTask.emit();
  }
  onPageChange(pageStateUpdate: Partial<GetTodosQueryParams>) {
    this.pageStateChange.emit(pageStateUpdate);
  }
  configurePaginatedSize() {
    this.paginatedSizes.push(this.selectedPageSize);
    let i = 5;
    while (i < this.totalPagesCount) {
      this.paginatedSizes.push(i);
      i += 5;
    }
    if (!this.paginatedSizes.includes(this.totalPagesCount)) {
      this.paginatedSizes.push(this.totalPagesCount);
    }
    this.paginatedSizes.sort();
    this.paginatedSizes = Array.from(new Set(this.paginatedSizes));

    this.paginatedSizes.sort((a: number, b: number) => a - b);
  }
  onSelectedPageLengthChange() {
    this.pageStateChange.emit({ take: this.selectedPageSize });
  }
  onSearch(e?: KeyboardEvent) {
    if (!e || (e && e.key === 'Enter')) {
      this.pageStateChange.emit({ search: this.searchBox });
    }
  }
}
