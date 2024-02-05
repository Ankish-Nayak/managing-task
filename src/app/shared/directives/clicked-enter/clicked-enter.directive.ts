import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClickedEnter]',
  standalone: true,
})
export class ClickedEnterDirective {
  @Output() clickedEnter = new EventEmitter<void>();
  constructor() {}

  @HostListener('keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    event.preventDefault();
    this.clickedEnter.emit();
  }
}
