import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ScrollDirective } from '../../shared/directives/scroll/scroll.directive';
import {
  GetNotificationsQueryParams,
  IGetNotificationsQueryParams,
} from '../../shared/interfaces/requests/notification.interface';
import { Notification } from '../../shared/models/notification.model';
import { TimeAgoPipe } from '../../shared/pipes/time-ago/time-ago.pipe';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { SpinnerComponent } from '../../sharedComponents/spinners/spinner/spinner.component';
import { LocalStorageKeys } from '../../utils/constants';
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  updateLocalStorageItem,
} from '../../utils/localStorageCRUD';

export enum NotificationTab {
  All = 'All',
  UnRead = 'Unread',
  Read = 'Read',
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe, SpinnerComponent, ScrollDirective],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  notifications!: Notification[];
  scrollableDiv: any;
  pageState: IGetNotificationsQueryParams = new GetNotificationsQueryParams(
    (() => {
      const data = getLocalStorageItem(LocalStorageKeys.GetNotifications);
      if (data) {
        console.log(data);
        return JSON.parse(data);
      } else {
        return {
          isPagination: true,
          index: 0,
          take: 10,
          isSeen: null,
        };
      }
    })(),
  );
  readonly NotificationTabs: NotificationTab[] = [
    NotificationTab.All,
    NotificationTab.Read,
    NotificationTab.UnRead,
  ];
  readonly NotificationTab = NotificationTab;
  selectedNotificationTab: NotificationTab = NotificationTab.All;
  scrollableIndex!: number;
  constructor(
    private notificationService: NotificationService,
    private elementRef: ElementRef,
  ) {}
  ngOnInit(): void {
    this.scrollableIndex = this.pageState.index;
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
    this.notificationService.markNotificationAsRead(id).subscribe(
      () => {},
      (e) => {
        console.log(e);
      },
      () => {},
    );
  }
  markAllAsRead() {
    const ids: number[] = [];
    this.notificationService.markNotificationsAsRead({
      notificationIDs: ids,
    });
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
  onBottom() {
    console.log('hitting');
  }
  ngOnDestroy(): void {
    removeLocalStorageItem(LocalStorageKeys.GetNotifications);
  }
  onScroll() {
    setTimeout(() => {
      const scrollableDiv =
        this.elementRef.nativeElement.querySelector('#scrollableDiv');
      if (
        scrollableDiv &&
        scrollableDiv.scrollHeight - scrollableDiv.scrollTop <=
          scrollableDiv.clientHeight
      ) {
        console.log('load more items');
        this.loadMore();
      }
    });
  }
  loadMore() {
    console.log(this.scrollableIndex);
    this.scrollableIndex++;
    const newPageState = {
      ...this.pageState,
      index: this.scrollableIndex,
    };
    this.notificationService.getNotifications(newPageState).subscribe((res) => {
      this.notifications.push(...res);
    });
  }
}
