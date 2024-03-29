import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {
  @Output() highlight = new EventEmitter<boolean>();
  constructor() {}
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight.emit(true);
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight.emit(false);
  }
}
