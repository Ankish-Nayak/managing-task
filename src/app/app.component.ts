import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ICONS } from './shared/icons/icons';
import { NotificationService } from './shared/services/notification/notification.service';
import { MessageToastComponent } from './sharedComponents/toasts/message-toast/message-toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MessageToastComponent,
    NotificationsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'managing-tasks';

  readonly ICONS = ICONS;
  showNotification!: boolean;
  constructor(private notificationService: NotificationService) {}
  ngOnInit(): void {
    this.notificationService.openNotificationMessageSource$.subscribe(
      (res) => {
        this.showNotification = res;
      },
      (e) => {
        console.log(e);
      },
      () => {},
    );
  }
}
