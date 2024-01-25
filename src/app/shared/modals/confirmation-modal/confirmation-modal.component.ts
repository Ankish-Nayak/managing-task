import { Component, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
})
export class ConfirmationModalComponent {
  @Input({ required: true }) deleteDepartmentEvent!: EventEmitter<boolean>;
  @Input({ required: true }) modalName!: string;

  constructor() {}

  confirm(confirmation: boolean) {
    this.deleteDepartmentEvent.emit(confirmation);
  }
}
