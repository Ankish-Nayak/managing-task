import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FrameComponent } from '../../shared/components/containers/frame/frame.component';
import { ICONS } from '../../shared/icons/icons';
import { ChatboxService } from '../../shared/services/chatbox/chatbox.service';
import { ChatComponent } from '../chat/chat.component';
import { NavbarComponent } from '../dashboard/navbar/navbar.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [
    RouterModule,
    NavbarComponent,
    ChatComponent,
    CommonModule,
    FrameComponent,
  ],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss',
})
export class PortalComponent implements OnInit, OnDestroy {
  readonly ICONS = ICONS;
  public showChatBox!: boolean;
  public chatFullSize!: boolean;
  private subscriptions: Subscription[] = [];
  constructor(private chatBoxService: ChatboxService) {}
  ngOnInit(): void {
    const subscription1 = this.chatBoxService.chatOpenMessageSource$.subscribe({
      next: (res) => {
        this.showChatBox = res;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {},
    });
    const subscription2 =
      this.chatBoxService.chatBoxFullSizeMessageSource$.subscribe({
        next: (res) => {
          this.chatFullSize = res;
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {},
      });
    this.subscriptions.push(...[subscription2, subscription1]);
  }
  public toggleChatBox() {
    if (this.showChatBox) {
      this.chatBoxService.closeChat();
    } else {
      this.chatBoxService.openChat();
    }
  }
  public onFullSizeChange(e: boolean) {
    if (e) {
      this.chatBoxService.fullChatBoxSize();
    } else {
      this.chatBoxService.smallChatBoxSize();
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
