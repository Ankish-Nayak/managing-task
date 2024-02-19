import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ICONS } from '../../../icons/icons';

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
  readonly ICONS = ICONS;
  @ViewChild('wrapper') wrapperRef!: ElementRef;
  @ViewChild('topBar') topBarRef!: ElementRef;
  @Input({ required: true }) fullSize!: boolean;
  @Output() fullSizeChange = new EventEmitter<boolean>();
  @Output() closeFrame = new EventEmitter();
  public position: ICooridinate = {
    x: 100,
    y: 100,
  };
  private size: ISize = {
    w: 200,
    h: 200,
  };
  private lastPosition!: ICooridinate;
  private lastSize!: ISize;
  private minSize: ISize = {
    w: 200,
    h: 200,
  };
  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private window: Window,
  ) {}

  startDrag($event: MouseEvent): void {
    $event.preventDefault();

    const mouseX = $event.clientX;
    const mouseY = $event.clientY;

    const positionX = this.position.x;
    const positionY = this.position.y;

    const draggableDiv = this.wrapperRef.nativeElement;

    const draggableWidth = draggableDiv.offsetWidth;
    const draggableHeight = draggableDiv.offsetHeight;

    const duringDrag = (e: MouseEvent) => {
      const dx = e.clientX - mouseX;
      const dy = e.clientY - mouseY;

      let newX = positionX + dx;
      let newY = positionY + dy;

      const windowWidth = this.window.innerWidth;
      const windowHeight = this.window.innerHeight;

      if (newX + draggableWidth > windowWidth) {
        newX = windowWidth - draggableWidth;
      } else if (newX < 0) {
        // Adjust newX if it's less than 0
        newX = 0;
      }
      // Adjust newY if it exceeds window height
      if (newY + draggableHeight > windowHeight) {
        newY = windowHeight - draggableHeight;
      } else if (newY < 0) {
        // Adjust newY if it's less than 0
        newY = 0;
      }

      // Update position
      this.position.x = newX;
      this.position.y = newY;

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
  public close() {
    this.closeFrame.emit();
  }
  public changeSize() {
    this.fullSize = !this.fullSize;
    this.fullSizeChange.emit(this.fullSize);
  }
  public minimizeTab() {}
  private toggleSize() {}
}
