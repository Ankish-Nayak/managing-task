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
  showChatBox!: boolean;
  chatFullSize!: boolean;
  constructor(private chatBoxService: ChatboxService) {}
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
    this.chatBoxService.chatBoxFullSizeMessageSource$.subscribe((res) => {
      this.chatFullSize = res;
    });
  }
  toggleChatBox() {
    if (this.showChatBox) {
      this.chatBoxService.closeChat();
    } else {
      this.chatBoxService.openChat();
    }
  }
  onFullSizeChange(e: boolean) {
    if (e) {
      this.chatBoxService.fullChatBoxSize();
    } else {
      this.chatBoxService.smallChatBoxSize();
    }
  }
}
