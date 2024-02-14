import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
// import { CHATTAB, ChatTab } from '../../../components/chat/chat.component';
import { LocalStorageKeys } from '../../../utils/constants';
import { getLocalStorageItem } from '../../../utils/localStorageCRUD';
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

// const ChatTab: ChatTab = {
//   name: 'Chats',
//   id: null,
// };

@Injectable({
  providedIn: 'root',
})
export class ChatboxService {
  private apiUrl = `${environment.BASE_URL}/CommunityMessage`;
  private _chatOpen = new BehaviorSubject<boolean>(false);
  private _chatTabs = new BehaviorSubject<ChatTab[]>([CHATTAB]);
  private _selectedChatTab = new BehaviorSubject<ChatTab>(CHATTAB);
  chatTabsMessageSource$ = this._chatTabs.asObservable();
  chatOpenMessageSource$ = this._chatOpen.asObservable();
  selectedChatTabMessageSource$ = this._selectedChatTab.asObservable();
  constructor(
    private http: HttpClient,
    private chatboxAdapter: ChatBoxAdapter,
    private messageAdpater: MessageAdapter,
  ) {}
  closeChat() {
    this._chatOpen.next(false);
  }
  openChat() {
    this._chatOpen.next(true);
  }
  addChatTab(tab: ChatTab) {
    if (this._chatTabs.getValue().findIndex((t) => t.id === tab.id) !== -1) {
      return;
    }
    this._chatTabs.next([...this._chatTabs.getValue(), tab]);
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
    this._chatTabs.next([
      ...this._chatTabs.getValue().filter((t) => t.id === tab.id),
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
