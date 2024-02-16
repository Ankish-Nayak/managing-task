import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appLongPress]',
  standalone: true,
})
export class LongPressDirective {
  private pressTimer!: any;
  @Input() timer: number = 500;
  @Output() longPressed = new EventEmitter();

  constructor() {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(_event: MouseEvent) {
    this.pressTimer = setTimeout(() => {
      this.longPressed.emit();
    }, this.timer);
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  onMouseUp() {
    clearTimeout(this.pressTimer);
  }

  @HostListener('click')
  onClick() {
    clearTimeout(this.pressTimer);
  }
}
