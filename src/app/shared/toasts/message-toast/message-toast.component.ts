import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast/toast.service';

export type Tmessage = 'error' | 'success' | 'normal' | 'info';

@Component({
  selector: 'app-message-toast',
  standalone: true,
  imports: [CommonModule, NgbToast],
  templateUrl: './message-toast.component.html',
  styleUrl: './message-toast.component.scss',
})
export class MessageToastComponent {
  constructor(public toastService: ToastService) {}
  provideClass(id: number) {
    const toast = this.toastService.toasts.at(id);
    if (toast?.messageType === 'error') {
      return 'bg-danger';
    } else if (toast?.messageType === 'success') {
      return 'bg-success text-white';
    } else if (toast?.messageType === 'info') {
      return 'bg-secondary text-white';
    } else {
      return '';
    }
  }
}
