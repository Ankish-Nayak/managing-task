import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IGetNotificationPostData } from '../../shared/interfaces/requests/notification.interface';
import { Notification } from '../../shared/models/notification.model';
import { TimeAgoPipe } from '../../shared/pipes/time-ago/time-ago.pipe';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { LocalStorageKeys } from '../../utils/constants';
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  updateLocalStorageItem,
} from '../../utils/localStorageCRUD';
import { SpinnerComponent } from '../../sharedComponents/spinners/spinner/spinner.component';

export enum NotificationTab {
  All = 'All',
  UnRead = 'Unread',
  Read = 'Read',
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe, SpinnerComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  notifications!: Notification[];
  pageState: IGetNotificationPostData = (() => {
    const data = getLocalStorageItem(LocalStorageKeys.GetNotifications);
    if (data) {
      console.log(data);
      return JSON.parse(data);
    } else {
      return {
        isSeen: null,
      };
    }
  })();
  readonly NotificationTabs: NotificationTab[] = [
    NotificationTab.All,
    NotificationTab.Read,
    NotificationTab.UnRead,
  ];
  readonly NotificationTab = NotificationTab;
  selectedNotificationTab: NotificationTab = NotificationTab.All;
  constructor(private notificationService: NotificationService) {}
  ngOnInit(): void {
    this.selectedNotificationTab = (() => {
      if (this.pageState.isSeen === null) {
        return NotificationTab.All;
      } else if (this.pageState.isSeen) {
        return NotificationTab.Read;
      }
      return NotificationTab.UnRead;
    })();
    this.onPageStateChange();
  }
  markAsRead(id: number) {
    this.notificationService.markNotificationAsRead(id);
  }
  markAllAsRead() {
    const ids: number[] = [];
    this.notificationService.markNotificationsAsRead(ids);
  }
  onPageStateChange() {
    updateLocalStorageItem(
      LocalStorageKeys.GetNotifications,
      JSON.stringify(this.pageState),
    );
    this.isLoading = true;
    this.notificationService.getNotifications(this.pageState).subscribe(
      (res) => {
        console.log(res);
        this.notifications = res;
      },
      (e) => {
        console.log(e);
      },
      () => {
        this.isLoading = false;
      },
    );
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
  ngOnDestroy(): void {
    removeLocalStorageItem(LocalStorageKeys.GetNotifications);
  }
}
