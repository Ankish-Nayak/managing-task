import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {
  // @Input({required: true}) id!: number;
  constructor(private e: ElementRef) {}
  @Output() highlight = new EventEmitter<boolean>();
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight.emit(true);
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight.emit(false);
  }
}
