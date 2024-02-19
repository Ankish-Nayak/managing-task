import { CommonModule } from '@angular/common';
import {
  Component,
  DoCheck,
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
export class PaginationComponent implements OnInit, OnChanges, DoCheck {
  @Input() defaultSelectedPaginatedSize: number = 10;
  @Input({ required: true }) collectionSize!: number;
  @Input({ transform: (value: number) => value + 1 }) selectedPage: number = 1;
  @Input({ required: true }) selectedPaginatedSize: number = 10;
  @Input() viewPages: number = 3;
  @Output() selectedPageChange: EventEmitter<number> =
    new EventEmitter<number>();
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() selectedPaginatedSizeChange = new EventEmitter<number>();
  public pages: number[] = [];
  public paginatedSizes: number[] = [];
  public leftDisabled: boolean = false;
  public rightDisabled: boolean = false;
  private pagesCount: number = 0;
  private span: number = 3;
  private left: number = 1;
  private right: number = 1;
  ngOnInit(): void {
    this.pagesInit();
    this.configurePaginatedSize();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (changes['collectionSize']) {
        this.pagesInit();
        this.configurePaginatedSize();
      }
      this.renderPages();
    }
  }
  public onSelectedPaginatedSizeChange() {
    this.selectedPaginatedSizeChange.emit(this.selectedPaginatedSize);
    this.pagesInit();
  }

  private configurePaginatedSize() {
    this.paginatedSizes = [];
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
    this.paginatedSizes = this.paginatedSizes.filter(
      (page) => page <= this.collectionSize,
    );
    // if (this.selectedPaginatedSize > this.collectionSize) {
    //   this.selectedPaginatedSize =
    //     this.paginatedSizes[this.paginatedSizes.length - 1];
    // } else {
    //   this.selectedPaginatedSize = this.defaultSelectedPaginatedSize;
    // }
  }

  private pagesInit() {
    this.pages = [];
    this.pagesCount = Math.ceil(
      this.collectionSize / this.selectedPaginatedSize,
    );
    this.left = 1;
    this.span = Math.min(this.viewPages, this.pagesCount);
    this.right = this.span;
    this.renderPages();
    this.selectedPage = Math.min(this.selectedPage, this.pagesCount);
    this.whetherDisableButtons();
  }
  private renderPages() {
    this.pages = [];
    for (let i = this.left; i <= this.right; ++i) {
      this.pages.push(i);
    }
  }
  public onNext() {
    if (!this.rightDisabled) {
      if (this.selectedPage === this.right) {
        this.left = this.right + 1;
        this.right = this.right + this.span;
        this.left = Math.min(this.left, this.pagesCount);
        this.right = Math.min(this.right, this.pagesCount);
        this.renderPages();
      }
      this.selectedPage++;
      this.onPageChange();
      this.whetherDisableButtons();
    }
  }
  public onPrev() {
    if (!this.leftDisabled) {
      if (this.selectedPage === this.left) {
        this.right = this.left - 1;
        this.left = this.left - this.span;
        this.left = Math.max(1, this.left);
        this.right = Math.max(1, this.right);
        this.renderPages();
      }
      this.selectedPage--;
      this.onPageChange();
      this.whetherDisableButtons();
    }
  }
  public onSelectPage(pageNumber: number) {
    if (this.selectedPage !== pageNumber) {
      this.selectedPage = pageNumber;
      this.onPageChange();
      this.whetherDisableButtons();
    }
  }
  private onPageChange() {
    this.selectedPageChange.emit(this.selectedPage - 1);
    this.pageChange.emit(this.selectedPage - 1);
  }
  private whetherDisableButtons() {
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
  ngDoCheck(): void {}
}
