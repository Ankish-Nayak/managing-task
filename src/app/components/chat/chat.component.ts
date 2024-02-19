import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { Subscription } from 'rxjs';
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
export class ChatComponent implements OnInit, OnDestroy, OnDestroy {
  readonly ICONS = ICONS;
  readonly END_POINTS = END_POINTS;
  public searchBoxInput: string = '';
  public isLoading = false;
  public chatTabs!: ChatTab[];
  public selectedChatTab!: ChatTab;
  public fullSize!: boolean;
  public suggestions: ChatTab[] = [];
  public renderSuggestions: boolean = false;
  private subscriptions: Subscription[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatboxService: ChatboxService,
    private employeeService: EmployeeService,
  ) {}
  ngOnInit(): void {
    this.getSelectedChatTab();
    this.getChatTabs();
    const subscription1 = this.route.queryParamMap.subscribe((params) => {
      const id = params.get('id');
      const name = params.get('name');
      if (id && name) {
        this.addingChatTab({
          id: Number(id),
          name,
        });
      }
    });
    const subscription2 = this.router.events.subscribe(() => {
      this.getActiveTab();
    });
    this.subscriptions.push(...[subscription2, subscription1]);
    this.getFullSize();
  }
  private getFullSize() {
    const subscription =
      this.chatboxService.chatBoxFullSizeMessageSource$.subscribe({
        next: (res) => {
          this.fullSize = res;
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {},
      });
    this.subscriptions.push(subscription);
  }
  private getSelectedChatTab() {
    const subscription =
      this.chatboxService.selectedChatTabMessageSource$.subscribe({
        next: (res) => {
          this.selectedChatTab = res;
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {},
      });
    this.subscriptions.push(subscription);
  }
  private getChatTabs() {
    const subscription = this.chatboxService.chatTabsMessageSource$.subscribe({
      next: (res) => {
        this.chatTabs = res;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {},
    });
    this.subscriptions.push(subscription);
  }
  private getActiveTab() {
    const activeEndPoint = getActiveEndpoint(this.route);
    if (activeEndPoint === `./${END_POINTS.chatBox}`) {
      this.chatboxService.changeSelectedTab(
        this.chatTabs.find((v) => v.id === null)!,
      );
    } else {
      const subscription = this.route.queryParamMap.subscribe((params) => {
        const id = params.get('id');
        if (id) {
          this.chatboxService.changeSelectedTab(
            this.chatTabs.find((v) => v.id?.toString() === id) ?? CHATTAB,
          );
        }
      });
      this.subscriptions.push(subscription);
    }
  }
  public addingChatTab(tab: ChatTab) {
    if (this.suggestions.length > 0) {
      this.suggestions = [];
      this.searchBoxInput = '';
    }
    this.chatboxService.addChatTab(tab);
  }
  public onSelectTab(tab: ChatTab) {
    this.chatboxService.changeSelectedTab(tab);
  }
  public deleteTab(tab: ChatTab) {
    this.chatboxService.removeChatTab(tab);
  }

  public searchEmployees() {
    this.renderSuggestions = true;
    const subscription = this.employeeService
      .getSuggestions(this.searchBoxInput)
      .subscribe((res) => {
        this.suggestions = res;
      });
    this.subscriptions.push(subscription);
  }
  public onSearchBoxChange() {
    console.log(this.searchBoxInput);
    if (this.searchBoxInput === '') {
      this.suggestions = [];
    }
  }
  public onFocus() {}
  ngOnDestroy() {
    removeLocalStorageItem(LocalStorageKeys.GetChatTabs);
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    });
  }
}
