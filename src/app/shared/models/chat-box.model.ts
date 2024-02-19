import { Injectable } from '@angular/core';
import { IChatBox } from '../interfaces/requests/chatbox.interface';
import { Adapter } from './adapter';

export class ChatBox implements IChatBox {
  public employeeId: number;
  public employeeName: string;
  public lastMessage: string;
  public isSeen: boolean;
  public newMessages: number;
  public recieverId: number;
  public recieverName: string;
  public lastActive: string;

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
  public adapt(data: IChatBox): ChatBox {
    return new ChatBox(data);
  }

  public adaptArray(dataArray: IChatBox[]): ChatBox[] {
    return dataArray.map((data) => this.adapt(data));
  }
}
