import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { ICONS } from '../../shared/icons/icons';
import {
  CHATTAB,
  ChatTab,
  ChatboxService,
} from '../../shared/services/chatbox/chatbox.service';
import { END_POINTS, LocalStorageKeys } from '../../utils/constants';
import { getActiveEndpoint } from '../../utils/getActiveEndpoint';
import { removeLocalStorageItem } from '../../utils/localStorageCRUD';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';

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
  isLoading = false;
  chatTabs!: ChatTab[];
  readonly ICONS = ICONS;
  selectedChatTab!: ChatTab;
  readonly END_POINTS = END_POINTS;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatboxService: ChatboxService,
  ) {}
  ngOnInit(): void {
    this.getSelectedChatTab();
    this.getChatTabs();
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
  getSelectedChatTab() {
    this.chatboxService.selectedChatTabMessageSource$.subscribe((res) => {
      this.selectedChatTab = res;
    });
  }
  getChatTabs() {
    this.chatboxService.chatTabsMessageSource$.subscribe((res) => {
      this.chatTabs = res;
    });
  }
  getActiveTab() {
    const activeEndPoint = getActiveEndpoint(this.route);
    if (activeEndPoint === `./${END_POINTS.chatBox}`) {
      this.chatboxService.changeSelectedTab(
        this.chatTabs.find((v) => v.id === null)!,
      );
    } else {
      this.route.queryParamMap.subscribe((params) => {
        const id = params.get('id');
        if (id) {
          this.chatboxService.changeSelectedTab(
            this.chatTabs.find((v) => v.id?.toString() === id) ?? CHATTAB,
          );
        }
      });
    }
  }
  addingChatTab(tab: ChatTab) {
    this.chatboxService.addChatTab(tab);
  }
  onSelectTab(tab: ChatTab) {
    this.chatboxService.changeSelectedTab(tab);
  }
  deleteTab(tab: ChatTab) {
    this.chatboxService.removeChatTab(tab);
  }
  ngOnDestroy(): void {
    removeLocalStorageItem(LocalStorageKeys.GetChatTabs);
  }
}
