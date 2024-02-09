import { Component, OnInit } from '@angular/core';
import { Notification } from '../../shared/models/notification.model';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../../shared/pipes/time-ago/time-ago.pipe';
import { IGetNotificationPostData } from '../../shared/interfaces/requests/notification.interface';

export enum NotificationTab {
  All = 'All',
  UnRead = 'Unread',
  Read = 'Read',
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit {
  notifications!: Notification[];
  pageState: IGetNotificationPostData = {
    isSeen: null,
  };
  readonly NotificationTabs: NotificationTab[] = [
    NotificationTab.All,
    NotificationTab.Read,
    NotificationTab.UnRead,
  ];
  readonly NotificationTab = NotificationTab;
  selectedNotificationTab: NotificationTab = NotificationTab.All;
  constructor(private notificationService: NotificationService) {}
  ngOnInit(): void {
    this.onPageStateChange();
    // this.notificationService
    //   .getNotifications({ isSeen: true })
    //   .subscribe((res) => {
    //     console.log(res);
    //     this.notifications = res;
    //   });
  }
  markAsRead(id: number) {
    this.notificationService.markNotificationAsRead(id);
  }
  markAllAsRead() {
    const ids: number[] = [];
    this.notificationService.markNotificationsAsRead(ids);
  }
  onPageStateChange() {
    this.notificationService
      .getNotifications(this.pageState)
      .subscribe((res) => {
        console.log(res);
        this.notifications = res;
      });
  }
  onTabChange(updatedTab: NotificationTab) {
    this.selectedNotificationTab = updatedTab;
    const updatedPageStateValue = () => {
      if (updatedTab === NotificationTab.All) {
        return null;
      } else if (updatedTab === NotificationTab.Read) {
        return true;
      } else {
        return false;
      }
    };
    this.pageState = {
      ...this.pageState,
      isSeen: updatedPageStateValue(),
    };
    this.onPageStateChange();
  }
}
