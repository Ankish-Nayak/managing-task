import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appClicked]',
  standalone: true,
})
export class ClickedDirective {
  @Output() clicked: EventEmitter<string> = new EventEmitter<string>();
  constructor(private e: ElementRef) {}
  @HostListener('click', ['$event.target'])
  onClick(target: HTMLElement) {
    this.clicked.emit(target.id);
  }
}
