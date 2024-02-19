import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClicked]',
  standalone: true,
})
export class ClickedDirective {
  @Output() clicked: EventEmitter<string> = new EventEmitter<string>();
  constructor() {}
  @HostListener('click', ['$event.target'])
  public onClick(target: HTMLElement) {
    this.clicked.emit(target.id);
  }
}
