import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { ConfirmationService } from '../../services/dialog/confirmation.service';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
})
export class ConfirmationModalComponent implements OnDestroy {
  @Input({ required: true }) modalName!: string;
  @Output() confirmation = new EventEmitter<boolean>();
  constructor(private confirmationDialogService: ConfirmationService) {}

  confirm(confirmation: boolean) {
    this.confirmation.emit(confirmation);
    // this.confirmationDialogService.confirm(confirmation);
  }
  ngOnDestroy(): void {
    // this.confirmationDialogService.reset();
  }
}
