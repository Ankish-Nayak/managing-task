import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { ICONS } from '../../shared/icons/icons';
import { END_POINTS, LocalStorageKeys } from '../../utils/constants';
import { getActiveEndpoint } from '../../utils/getActiveEndpoint';
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '../../utils/localStorageCRUD';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';

export interface ChatTab {
  name: string;
  id: number | null;
}

const ChatTab: ChatTab = {
  name: 'Chats',
  id: null,
};

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterLink,
    ChatBoxComponent,
    ChatMessageComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  chatTabs: ChatTab[] = (() => {
    const data = getLocalStorageItem(LocalStorageKeys.GetChatTabs);
    if (data) {
      return JSON.parse(data);
    } else {
      return [ChatTab];
    }
  })();
  readonly ICONS = ICONS;
  selectedChatTab: ChatTab = ChatTab;
  readonly END_POINTS = END_POINTS;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const id = params.get('id');
      const name = params.get('name');
      if (id && name) {
        this.addingChatTab({
          id: Number(id),
          name,
        });
      }
    });
    this.router.events.subscribe(() => {
      this.getActiveTab();
    });
  }
  getActiveTab() {
    const activeEndPoint = getActiveEndpoint(this.route);
    if (activeEndPoint === `./${END_POINTS.chatBox}`) {
      this.selectedChatTab = this.chatTabs.find((v) => v.id === null)!;
    } else {
      this.route.queryParamMap.subscribe((params) => {
        const id = params.get('id');
        console.log('id', id);
        if (id) {
          this.selectedChatTab =
            this.chatTabs.find((v) => v.id?.toString() === id) ?? ChatTab;
        }
      });
    }
  }
  addingChatTab(tab: ChatTab) {
    if (tab.id === null) {
      this.selectedChatTab = tab;
      return;
    }
    const existingTab = this.chatTabs.find((t) => t.id === tab.id);
    if (existingTab) {
      const messageTabs = this.chatTabs.filter(
        (t) => t.id !== null && t.id !== existingTab.id,
      );
      this.chatTabs = [ChatTab, existingTab, ...messageTabs];
      setLocalStorageItem(
        LocalStorageKeys.GetChatTabs,
        JSON.stringify(this.chatTabs),
      );
      this.selectedChatTab = existingTab;
    } else {
      if (this.chatTabs.length === 4) {
        this.chatTabs.pop();
      }
      const messageTabs = this.chatTabs.filter((t) => t.id !== null);
      this.chatTabs = [
        ChatTab,
        {
          name: tab.name,
          id: tab.id,
        },
        ...messageTabs,
      ];
      setLocalStorageItem(
        LocalStorageKeys.GetChatTabs,
        JSON.stringify(this.chatTabs),
      );
      this.selectedChatTab = tab;
    }
  }
  onSelectTab(tab: ChatTab) {
    this.selectedChatTab = tab;
  }
  deleteTab(tab: ChatTab) {
    if (this.selectedChatTab.id === tab.id) {
      this.selectedChatTab = ChatTab;
    }
    this.chatTabs = this.chatTabs.filter((c) => c.id !== tab.id);
    setLocalStorageItem(
      LocalStorageKeys.GetChatTabs,
      JSON.stringify(this.chatTabs),
    );
  }
  ngOnDestroy(): void {
    removeLocalStorageItem(LocalStorageKeys.GetChatTabs);
  }
}
