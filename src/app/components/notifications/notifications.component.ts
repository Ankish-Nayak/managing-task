import { Component, OnInit } from '@angular/core';
import { Notification } from '../../shared/models/notification.model';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../../shared/pipes/time-ago/time-ago.pipe';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit {
  notifications!: Notification[];
  constructor(private notificationService: NotificationService) {}
  ngOnInit(): void {
    this.notificationService
      .getNotifications({ isSeen: true })
      .subscribe((res) => {
        console.log(res);
        this.notifications = res;
      });
  }
  markAsRead(id: number) {
    this.notificationService.markNotificationAsRead(id);
  }
  markAllAsRead() {
    const ids: number[] = [];
    this.notificationService.markNotificationsAsRead(ids);
  }
}
