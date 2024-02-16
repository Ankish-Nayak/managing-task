import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { EmployeeService } from '../../shared/services/employee/employee.service';
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
    FormsModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  searchBoxInput: string = '';
  isLoading = false;
  chatTabs!: ChatTab[];
  readonly ICONS = ICONS;
  selectedChatTab!: ChatTab;
  readonly END_POINTS = END_POINTS;
  fullSize!: boolean;
  suggestions: ChatTab[] = [];
  renderSuggestions: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatboxService: ChatboxService,
    private employeeService: EmployeeService,
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
    this.getFullSize();
  }
  getFullSize() {
    this.chatboxService.chatBoxFullSizeMessageSource$.subscribe(
      (res) => {
        this.fullSize = res;
      },
      (e) => {
        console.log(e);
      },
      () => {},
    );
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
    if (this.suggestions.length > 0) {
      this.suggestions = [];
      this.searchBoxInput = '';
    }
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
  searchEmployees() {
    this.renderSuggestions = true;
    this.employeeService
      .getSuggestions(this.searchBoxInput)
      .subscribe((res) => {
        this.suggestions = res;
      });
  }
  onSearchBoxChange() {
    console.log(this.searchBoxInput);
    if (this.searchBoxInput === '') {
      this.suggestions = [];
    }
  }
  onFocus() {}
}
