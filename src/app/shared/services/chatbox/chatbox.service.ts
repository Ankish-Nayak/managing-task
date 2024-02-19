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
  IDeleteMessagePostData,
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
  public chatBoxFullSizeMessageSource$ = this._chatBoxFullSize.asObservable();
  public chatTabsMessageSource$ = this._chatTabs.asObservable();
  public chatOpenMessageSource$ = this._chatOpen.asObservable();
  public selectedChatTabMessageSource$ = this._selectedChatTab.asObservable();
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
  public smallChatBoxSize() {
    this._chatBoxFullSize.next(false);
  }
  public fullChatBoxSize() {
    this._chatBoxFullSize.next(true);
  }
  public closeChat() {
    if (this._chatOpen.getValue() === false) return;
    removeLocalStorageItem(LocalStorageKeys.GetChatTabs);
    removeLocalStorageItem(LocalStorageKeys.SelectedChatTab);
    this._chatOpen.next(false);
  }
  public openChat() {
    if (this._chatOpen.getValue() === true) return;
    this._chatOpen.next(true);
  }
  public addChatTab(tab: ChatTab) {
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
  public changeSelectedTab(tab: ChatTab) {
    if (this._selectedChatTab.getValue().id === tab.id) {
      return;
    }
    this._selectedChatTab.next(tab);
  }
  public removeChatTab(tab: ChatTab) {
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
  public get Headers() {
    const token = getLocalStorageItem(LocalStorageKeys.AuthToken);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
  public deleteMessage(id: number) {
    return this.deleteMessages([id]);
    // return this.http.delete<IDeleteApiRes>(
    //   `${this.apiUrl}/DeleteMessage/${id}`,
    //   {
    //     withCredentials: true,
    //     headers: this.Headers,
    //   },
    // );
  }
  public sendMessage(
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
  public displayMessage(
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
  public convertUtcToIst(utcTime: string): string {
    return utcTime;
  }
  public getChatBox() {
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
  public deleteMessages(idsTodDeleted: number[]) {
    const data: IDeleteMessagePostData = {
      ids: idsTodDeleted,
    };
    const options = {
      headers: this.Headers,
      body: data,
    };
    return this.http.delete<IDeleteApiRes>(
      `${this.apiUrl}/DeleteMessage`,
      options,
    );
  }
}
