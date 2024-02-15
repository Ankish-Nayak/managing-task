import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ICONS } from '../../shared/icons/icons';
import { ChatboxService } from '../../shared/services/chatbox/chatbox.service';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { FrameComponent } from '../../sharedComponents/containers/frame/frame.component';
import { ChatComponent } from '../chat/chat.component';
import { NavbarComponent } from '../dashboard/navbar/navbar.component';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [
    RouterModule,
    NavbarComponent,
    ChatComponent,
    CommonModule,
    FrameComponent,
    NotificationsComponent,
  ],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss',
})
export class PortalComponent implements OnInit {
  readonly ICONS = ICONS;
  showChatBox!: boolean;
  showNotification!: boolean;
  constructor(
    private chatBoxService: ChatboxService,
    private notificationService: NotificationService,
  ) {}
  ngOnInit(): void {
    this.chatBoxService.chatOpenMessageSource$.subscribe(
      (res) => {
        console.log('called');
        this.showChatBox = res;
      },
      (e) => {
        console.log(e);
      },
      () => {},
    );
    this.notificationService.openNotificationMessageSource$.subscribe((res) => {
      this.showNotification = res;
    });
  }
  toggleChatBox() {
    if (this.showChatBox) {
      this.chatBoxService.closeChat();
    } else {
      this.chatBoxService.openChat();
    }
  }
}
