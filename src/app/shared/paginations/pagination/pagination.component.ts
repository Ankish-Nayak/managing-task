import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent implements OnInit, OnChanges {
  @Output() selectedPageChange: EventEmitter<number> =
    new EventEmitter<number>();
  @Input({ required: true }) collectionSize!: number;
  pages: number[] = [];
  pagesCount: number = 0;
  @Input() selectedPage: number = 1;
  leftDisabled: boolean = false;
  rightDisabled: boolean = false;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Input({ required: true }) selectedPaginatedSize: number = 10;
  @Output() selectedPaginatedSizeChange = new EventEmitter<number>();
  paginatedSizes: number[] = [];

  ngOnInit(): void {
    this.configurePaginatedSize();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.pagesInit();
    }
  }

  onSelectedPaginatedSizeChange() {
    this.selectedPaginatedSizeChange.emit(this.selectedPaginatedSize);
    this.pagesInit();
  }

  configurePaginatedSize() {
    console.log(this.collectionSize);
    this.paginatedSizes.push(this.selectedPaginatedSize);
    let i = 5;
    while (i < this.collectionSize) {
      this.paginatedSizes.push(i);
      i += 5;
    }
    if (!this.paginatedSizes.includes(this.collectionSize)) {
      this.paginatedSizes.push(this.collectionSize);
    }
    this.paginatedSizes.push(1);
    this.paginatedSizes.sort();
    this.paginatedSizes = Array.from(new Set(this.paginatedSizes));

    this.paginatedSizes.sort((a: number, b: number) => a - b);
  }

  pagesInit() {
    this.pagesCount = 0;
    this.pages = [];
    this.pagesCount = Math.ceil(
      this.collectionSize / this.selectedPaginatedSize,
    );
    for (let i = 0; i < this.pagesCount; ++i) {
      this.pages.push(i + 1);
    }
    this.whetherDisableButtons();
  }
  onNext(e: MouseEvent) {
    e.preventDefault();
    if (!this.rightDisabled) {
      this.selectedPage++;
      this.onPageChange();
      this.whetherDisableButtons();
    }
  }
  onPrev(e: MouseEvent) {
    e.preventDefault();
    if (!this.leftDisabled) {
      this.selectedPage--;
      this.onPageChange();
      this.whetherDisableButtons();
    }
  }
  onSelectPage(e: MouseEvent, pageNumber: number) {
    e.preventDefault();
    if (this.selectedPage !== pageNumber) {
      this.selectedPage = pageNumber;
      this.onPageChange();
      this.whetherDisableButtons();
    }
  }
  onPageChange() {
    this.selectedPageChange.emit(this.selectedPage);
    this.pageChange.emit(this.selectedPage);
  }
  whetherDisableButtons() {
    if (this.selectedPage === 1) {
      this.leftDisabled = true;
    } else {
      this.leftDisabled = false;
    }
    if (this.selectedPage === this.pagesCount) {
      this.rightDisabled = true;
    } else {
      this.rightDisabled = false;
    }
  }
}
