import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { LocalStorageKeys } from '../../../utils/constants';
import { getLocalStorageItem } from '../../../utils/localStorageCRUD';
import {
  IDeleteApiRes,
  IDisplayMessage,
  IGetChatBoxRes,
  ISendMessage,
} from '../../interfaces/requests/chatbox.interface';
import { map } from 'rxjs';
import { ChatBoxAdapter } from '../../models/chat-box.model';
import { MessageAdapter } from '../../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatboxService {
  private apiUrl = `${environment.BASE_URL}`;
  constructor(
    private http: HttpClient,
    private chatboxAdapter: ChatBoxAdapter,
    private messageAdpater: MessageAdapter,
  ) {}
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
  displayMessage(employeeId: number) {
    return this.http
      .get<IDisplayMessage>(`${this.apiUrl}/DisplayMessage/${employeeId}`, {
        withCredentials: true,
        headers: this.Headers,
      })
      .pipe(
        map((res) => {
          return this.messageAdpater.adaptArray(res.iterableData);
        }),
      );
  }
  getChatBox() {
    return this.http
      .get<IGetChatBoxRes>(`${this.apiUrl}/GetChatBox`, {
        withCredentials: true,
        headers: this.Headers,
      })
      .pipe(
        map((res) => {
          return this.chatboxAdapter.adaptArray(res.iterableData);
        }),
      );
  }
}
