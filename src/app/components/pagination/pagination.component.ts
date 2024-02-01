import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent implements OnInit {
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() pageSize: number = 10;
  @Input() collectionSize: number = 70;
  pages: number[] = [];
  pagesCount: number = 0;
  @Input() selectedPage: number = 1;
  leftDisabled: boolean = false;
  rightDisabled: boolean = false;

  ngOnInit(): void {
    this.pagesCount = Math.ceil(this.collectionSize / this.pageSize);
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
    if (this.selectedPage !== pageNumber) this.onPageChange();
    this.selectedPage = pageNumber;
    this.whetherDisableButtons();
  }
  onPageChange() {
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
