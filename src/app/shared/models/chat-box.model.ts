import { Injectable } from '@angular/core';
import { IChatBox } from '../interfaces/requests/chatbox.interface';
import { Adapter } from './adapter';

export class ChatBox implements IChatBox {
  employeeId: number;
  employeeName: string;
  lastMessage: string;
  isSeen: boolean;
  newMessages: number;
  recieverId: number;
  recieverName: string;
  lastActive: string;

  constructor(data: IChatBox) {
    this.employeeId = data.employeeId;
    this.employeeName = data.employeeName;
    this.lastMessage = data.lastMessage;
    this.isSeen = data.isSeen;
    this.newMessages = data.newMessages;
    this.recieverId = data.recieverId;
    this.recieverName = data.recieverName;
    this.lastActive = data.lastActive;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ChatBoxAdapter implements Adapter<ChatBox> {
  adapt(data: IChatBox): ChatBox {
    return new ChatBox(data);
  }

  adaptArray(dataArray: IChatBox[]): ChatBox[] {
    return dataArray.map((data) => this.adapt(data));
  }
}
