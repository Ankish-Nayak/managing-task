import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-todo-pagination',
  standalone: true,
  imports: [NgbPagination],
  templateUrl: './todo-pagination.component.html',
  styleUrl: './todo-pagination.component.scss',
})
export class TodoPaginationComponent {
  @Output() selectedPage: EventEmitter<number> = new EventEmitter<number>();
  @Input({ required: true }) page!: number;
  @Input({ required: true }) totalPagesCount!: number;
  constructor() {}

  onPageChange(selectedPage: number) {
    this.selectedPage.emit(selectedPage);
    console.log(selectedPage);
  }
}
