import { Injectable } from '@angular/core';
import { Tmessage } from '../../../sharedComponents/toasts/message-toast/message-toast.component';

export interface ToastInfo {
  header: string;
  body: string;
  delay?: number;
  messageType: Tmessage;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: ToastInfo[] = [];
  constructor() {}
  show(header: string, body: string, messageType: Tmessage, delay?: number) {
    this.toasts.push({ header, body, messageType, delay });
  }
  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter((t) => t != toast);
  }
}
