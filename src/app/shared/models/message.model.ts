import { Injectable } from '@angular/core';
import { IMessage } from '../interfaces/requests/chatbox.interface';

export class Message implements IMessage {
  id: number;
  message: string;
  name: string;
  userType: string;
  isSeen: boolean;
  messageDate: string;

  constructor(data: IMessage) {
    this.id = data.id;
    this.message = data.message;
    this.name = data.name;
    this.userType = data.userType;
    this.isSeen = data.isSeen;
    this.messageDate = data.messageDate;
  }
}

@Injectable({
  providedIn: 'root',
})
export class MessageAdapter {
  adapt(data: IMessage): Message {
    return new Message(data);
  }
  adaptArray(dataArray: IMessage[]): Message[] {
    return dataArray.map((data) => this.adapt(data));
  }
}
