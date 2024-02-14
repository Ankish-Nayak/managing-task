import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ICONS } from '../../shared/icons/icons';
import { FrameComponent } from '../../sharedComponents/containers/frame/frame.component';
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
export class PortalComponent {
  readonly ICONS = ICONS;
  showChatBox: boolean = false;
  toggleChatBox() {
    this.showChatBox = !this.showChatBox;
  }
}
