import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast/toast.service';

export type Tmessage = 'error' | 'success' | 'normal';

@Component({
  selector: 'app-message-toast',
  standalone: true,
  imports: [CommonModule, NgbToast],
  templateUrl: './message-toast.component.html',
  styleUrl: './message-toast.component.scss',
})
export class MessageToastComponent {
  constructor(public toastService: ToastService) {}
  provideClass(state: Tmessage) {
    if (state === 'error') {
      return 'bg-danger';
    } else if (state === 'success') {
      return 'bg-success';
    } else {
      return '';
    }
  }
}
