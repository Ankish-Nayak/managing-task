import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { LocalStorageKeys } from '../../../utils/constants';
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '../../../utils/localStorageCRUD';
import {
  GetDisplayMessageQueryParams,
  IDeleteApiRes,
  IDisplayMessage,
  IGetChatBoxRes,
  ISendMessage,
} from '../../interfaces/requests/chatbox.interface';
import { ChatBoxAdapter } from '../../models/chat-box.model';
import { MessageAdapter } from '../../models/message.model';

export interface ChatTab {
  name: string;
  id: number | null;
}

export const CHATTAB: ChatTab = {
  name: 'Chats',
  id: null,
};

@Injectable({
  providedIn: 'root',
})
export class ChatboxService {
  private apiUrl = `${environment.BASE_URL}/CommunityMessage`;
  private _chatOpen = new BehaviorSubject<boolean>(
    (() => {
      const data = getLocalStorageItem(LocalStorageKeys.OpenChatBox);
      if (data) {
        return JSON.parse(data);
      } else {
        return false;
      }
    })(),
  );
  private _chatTabs = new BehaviorSubject<ChatTab[]>(
    (() => {
      const data = getLocalStorageItem(LocalStorageKeys.GetChatTabs);
      if (data) {
        return JSON.parse(data);
      } else {
        return [CHATTAB];
      }
    })(),
  );
  private _chatBoxFullSize = new BehaviorSubject<boolean>(true);
  private _selectedChatTab = new BehaviorSubject<ChatTab>(
    (() => {
      const data = getLocalStorageItem(LocalStorageKeys.SelectedChatTab);
      if (data) {
        return JSON.parse(data);
      } else {
        return CHATTAB;
      }
    })(),
  );
  chatBoxFullSizeMessageSource$ = this._chatBoxFullSize.asObservable();
  chatTabsMessageSource$ = this._chatTabs.asObservable();
  chatOpenMessageSource$ = this._chatOpen.asObservable();
  selectedChatTabMessageSource$ = this._selectedChatTab.asObservable();
  constructor(
    private http: HttpClient,
    private chatboxAdapter: ChatBoxAdapter,
    private messageAdpater: MessageAdapter,
  ) {
    this._chatTabs.subscribe((res) => {
      setLocalStorageItem(LocalStorageKeys.GetChatTabs, JSON.stringify(res));
    });
    this._selectedChatTab.subscribe((res) => {
      setLocalStorageItem(
        LocalStorageKeys.SelectedChatTab,
        JSON.stringify(res),
      );
    });
    this._chatOpen.subscribe((res) => {
      setLocalStorageItem(LocalStorageKeys.OpenChatBox, JSON.stringify(res));
    });
  }
  smallChatBoxSize() {
    this._chatBoxFullSize.next(false);
  }
  fullChatBoxSize() {
    this._chatBoxFullSize.next(true);
  }
  closeChat() {
    if (this._chatOpen.getValue() === false) return;
    removeLocalStorageItem(LocalStorageKeys.GetChatTabs);
    removeLocalStorageItem(LocalStorageKeys.SelectedChatTab);
    this._chatOpen.next(false);
  }
  openChat() {
    if (this._chatOpen.getValue() === true) return;
    this._chatOpen.next(true);
  }
  addChatTab(tab: ChatTab) {
    if (tab.id === null) {
      this._selectedChatTab.next(tab);
      return;
    }
    const existingTab = this._chatTabs.getValue().find((t) => t.id === tab.id);
    if (existingTab) {
      const messageTabs = this._chatTabs
        .getValue()
        .filter((t) => t.id !== null && t.id !== existingTab.id);

      const newTabs = [CHATTAB, existingTab, ...messageTabs];
      this._chatTabs.next(newTabs);
      this._selectedChatTab.next(existingTab);
    } else {
      const existingTabs = this._chatTabs.getValue();
      if (existingTabs && existingTabs.length === 4) {
        existingTabs.pop();
      }
      const messageTabs = existingTabs.filter((t) => t.id !== null);
      const newTabs = [
        CHATTAB,
        {
          name: tab.name,
          id: tab.id,
        },
        ...messageTabs,
      ];
      this._chatTabs.next(newTabs);
      this._selectedChatTab.next(tab);
    }
    if (this._chatOpen.getValue() === false) {
      this.openChat();
    }
  }
  changeSelectedTab(tab: ChatTab) {
    if (this._selectedChatTab.getValue().id === tab.id) {
      return;
    }
    this._selectedChatTab.next(tab);
  }
  removeChatTab(tab: ChatTab) {
    if (tab.id === null) {
      return;
    }
    if (tab.id === this._selectedChatTab.getValue().id) {
      this._selectedChatTab.next(CHATTAB);
    }
    this._chatTabs.next([
      ...this._chatTabs.getValue().filter((t) => t.id !== tab.id),
    ]);
  }
  get Headers() {
    const token = getLocalStorageItem(LocalStorageKeys.AuthToken);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
  deleteMessage(id: number) {
    return this.http.delete<IDeleteApiRes>(
      `${this.apiUrl}/DeleteMessage/${id}`,
      {
        withCredentials: true,
        headers: this.Headers,
      },
    );
  }
  sendMessage(
    recieverId: number,
    data: {
      message: string;
    },
  ) {
    return this.http.post<ISendMessage>(
      `${this.apiUrl}/SendMessage/${recieverId}`,
      data,
      {
        withCredentials: true,
        headers: this.Headers,
      },
    );
  }
  displayMessage(
    employeeId: number,
    data: Partial<GetDisplayMessageQueryParams>,
  ) {
    const transformedQueryParams = new GetDisplayMessageQueryParams(data);
    return this.http
      .post<IDisplayMessage>(
        `${this.apiUrl}/DisplayMessage/${employeeId}`,
        transformedQueryParams,
        {
          withCredentials: true,
          headers: this.Headers,
        },
      )
      .pipe(
        map((res) => {
          return this.messageAdpater.adaptArray(
            res.iterableData.map((m) => ({
              ...m,
              messageDate: this.convertUtcToIst(m.messageDate),
            })),
          );
        }),
      );
  }
  convertUtcToIst(utcTime: string): string {
    return utcTime;
  }
  getChatBox() {
    return this.http
      .get<IGetChatBoxRes>(`${this.apiUrl}/GetChatBox`, {
        withCredentials: true,
        headers: this.Headers,
      })
      .pipe(
        map((res) => {
          return this.chatboxAdapter.adaptArray(
            res.iterableData.map((m) => ({
              ...m,
              messageDate: this.convertUtcToIst(m.lastActive),
            })),
          );
        }),
      );
  }
}
