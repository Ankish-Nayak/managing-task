import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FrameComponent } from '../../shared/components/containers/frame/frame.component';
import { ICONS } from '../../shared/icons/icons';
import { ChatboxService } from '../../shared/services/chatbox/chatbox.service';
import { ChatComponent } from '../chat/chat.component';
import { NavbarComponent } from '../dashboard/navbar/navbar.component';

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
export class PortalComponent implements OnInit {
  readonly ICONS = ICONS;
  public showChatBox!: boolean;
  public chatFullSize!: boolean;
  constructor(private chatBoxService: ChatboxService) {}
  ngOnInit(): void {
    this.chatBoxService.chatOpenMessageSource$.subscribe({
      next: (res) => {
        console.log('called');
        this.showChatBox = res;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {},
    });
    this.chatBoxService.chatBoxFullSizeMessageSource$.subscribe({
      next: (res) => {
        this.chatFullSize = res;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {},
    });
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
}
