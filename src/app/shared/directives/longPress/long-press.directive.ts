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
  @Input() timer: number = 500;
  @Output() longPressed = new EventEmitter();
  private pressTimer!: any;
  constructor() {}
  @HostListener('mousedown', ['$event'])
  public onMouseDown(_event: MouseEvent) {
    this.pressTimer = setTimeout(() => {
      this.longPressed.emit();
    }, this.timer);
  }
  @HostListener('mouseup')
  @HostListener('mouseleave')
  public onMouseUp() {
    clearTimeout(this.pressTimer);
  }
  @HostListener('click')
  public onClick() {
    clearTimeout(this.pressTimer);
  }
}
