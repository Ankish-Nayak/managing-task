import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService } from '../../../services/dialog/confirmation.service';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
})
export class ConfirmationModalComponent {
  @Output() confirmation = new EventEmitter<boolean>();
  @Input() modalBody: string = 'Do you want to delete?';
  constructor(private confirmationService: ConfirmationService) {}

  confirm(confirmation: boolean) {
    this.confirmationService.confirm(confirmation);
    this.confirmation.emit(confirmation);
  }
}
