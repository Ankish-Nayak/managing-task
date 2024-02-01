import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-todo-pagination',
  standalone: true,
  imports: [CommonModule, NgbPagination, FormsModule],
  templateUrl: './todo-pagination.component.html',
  styleUrl: './todo-pagination.component.scss',
})
export class TodoPaginationComponent implements OnInit {
  @Output() selectedPage: EventEmitter<number> = new EventEmitter<number>();
  @Input({ required: true }) page!: number;
  @Input({ required: true }) totalPagesCount!: number;
  paginatedSizes: number[] = [];
  @Input({ required: true }) selectedPageSize!: number;
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();
  constructor() {}
  ngOnInit(): void {
    this.configurePaginatedSize();
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
  onPageChange(selectedPage: number) {
    this.selectedPage.emit(selectedPage);
    console.log(selectedPage);
  }
  onSelectionChange() {
    this.pageSizeChange.emit(this.selectedPageSize);
  }
}
