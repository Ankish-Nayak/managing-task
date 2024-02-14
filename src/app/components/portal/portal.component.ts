import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../dashboard/navbar/navbar.component';
import { ICONS } from '../../shared/icons/icons';
import { ChatComponent } from '../chat/chat.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [RouterModule, NavbarComponent, ChatComponent, CommonModule],
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
