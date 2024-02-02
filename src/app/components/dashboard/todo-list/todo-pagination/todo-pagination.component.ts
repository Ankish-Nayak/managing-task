import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { GetTodosQueryParams } from '../../../../shared/interfaces/requests/toto.interface';
import { PaginationComponent } from '../../../../shared/paginations/pagination/pagination.component';

@Component({
  selector: '[app-todo-pagination]',
  standalone: true,
  imports: [CommonModule, NgbPagination, FormsModule, PaginationComponent],
  templateUrl: './todo-pagination.component.html',
  styleUrl: './todo-pagination.component.scss',
})
export class TodoPaginationComponent implements OnInit {
  @Input({ required: true, transform: (value: number) => value + 1 })
  page!: number;
  @Input({ required: true }) totalPagesCount!: number;
  paginatedSizes: number[] = [];
  @Input({ required: true }) selectedPageSize!: number;
  @Output() pageStateChange: EventEmitter<Partial<GetTodosQueryParams>> =
    new EventEmitter<Partial<GetTodosQueryParams>>();
  constructor() {}
  ngOnInit(): void {
    this.configurePaginatedSize();
  }
  configurePaginatedSize() {
    console.log(this.totalPagesCount);
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
    this.pageStateChange.emit({ index: selectedPage - 1 });
    // this.selectedPage.emit(selectedPage);
    // console.log(selectedPage);
  }
  onSelectionChange() {
    this.pageStateChange.emit({ take: this.selectedPageSize });
    // this.pageSizeChange.emit(this.selectedPageSize);
  }
}
