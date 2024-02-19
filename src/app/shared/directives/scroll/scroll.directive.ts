import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appScroll]',
  standalone: true,
})
export class ScrollDirective {
  @Output() hit = new EventEmitter();
  constructor() {}
  @HostListener('window:scroll', ['$event'])
  onBottom() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this.hit.emit();
    }
  }
}
