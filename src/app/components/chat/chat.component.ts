import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { getActiveEndpoint } from '../../utils/getActiveEndpoint';
import { END_POINTS } from '../../utils/constants';

export enum ChatTab {
  Chats = 'Chats',
  Message = 'Message',
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  chatTabs: ChatTab[] = [ChatTab.Chats, ChatTab.Message];
  selectedChatTab: ChatTab = ChatTab.Chats;
  readonly ChatTab = ChatTab;
  readonly END_POINTS = END_POINTS;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.getActiveTab();
    });
  }
  getActiveTab() {
    const activeEndPoint = getActiveEndpoint(this.route);
    if (activeEndPoint === `./${END_POINTS.chatBox}`) {
      this.selectedChatTab = ChatTab.Chats;
    } else if (activeEndPoint === `./${END_POINTS.message}`) {
      this.selectedChatTab = ChatTab.Message;
    }
  }
  getNavLink(tab: ChatTab) {
    if (tab === ChatTab.Chats) {
      return [`./${END_POINTS.chatBox}`];
    }
    return [`./${END_POINTS.message}`];
  }
}
