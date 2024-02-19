import { Injectable } from '@angular/core';
import { Tmessage } from '../../components/toasts/message-toast/message-toast.component';

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
  public toasts: ToastInfo[] = [];
  constructor() {}
  public show(
    header: string,
    body: string,
    messageType: Tmessage,
    delay?: number,
  ) {
    this.toasts.push({ header, body, messageType, delay });
  }
  public remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter((t) => t != toast);
  }
}
