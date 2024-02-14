import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Output,
  ViewChild,
} from '@angular/core';
import { ICONS } from '../../../shared/icons/icons';

interface ICooridinate {
  x: number;
  y: number;
}

interface ISize {
  w: number;
  h: number;
}

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [],
  templateUrl: './frame.component.html',
  styleUrl: './frame.component.scss',
})
export class FrameComponent {
  @ViewChild('wrapper') wrapperRef!: ElementRef;
  @ViewChild('topBar') topBarRef!: ElementRef;

  position: ICooridinate = {
    x: 100,
    y: 100,
  };

  readonly ICONS = ICONS;
  size: ISize = {
    w: 200,
    h: 200,
  };

  lastPosition!: ICooridinate;
  lastSize!: ISize;

  minSize: ISize = {
    w: 200,
    h: 200,
  };
  @Output() closeFrame = new EventEmitter();
  constructor(@Inject(DOCUMENT) private _document: Document) {}

  startDrag($event: MouseEvent): void {
    $event.preventDefault();

    const mouseX = $event.clientX;
    const mouseY = $event.clientY;

    const positionX = this.position.x;
    const positionY = this.position.y;

    const duringDrag = (e: MouseEvent) => {
      const dx = e.clientX - mouseX;
      const dy = e.clientY - mouseY;

      this.position.x = positionX + dx;
      this.position.y = positionY + dy;

      this.lastPosition = {
        ...this.position,
      };
    };

    const finishDrag = () => {
      this._document.removeEventListener('mousemove', duringDrag);
      this._document.removeEventListener('mouseup', finishDrag);
    };

    // dynamically adding event listeners and removing as soon mousup event hits to
    // avoid unusable event listeners

    this._document.addEventListener('mousemove', duringDrag);
    this._document.addEventListener('mouseup', finishDrag);
  }
  close() {
    this.closeFrame.emit();
  }
}
