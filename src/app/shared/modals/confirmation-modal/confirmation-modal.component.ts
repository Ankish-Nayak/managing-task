import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
})
export class ConfirmationModalComponent {
  @Output() confirmation = new EventEmitter<boolean>();
  constructor() {}

  confirm(confirmation: boolean) {
    this.confirmation.emit(confirmation);
  }
}
