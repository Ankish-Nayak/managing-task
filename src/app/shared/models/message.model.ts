import { Injectable } from '@angular/core';
import { IMessage } from '../interfaces/requests/chatbox.interface';

export class Message implements IMessage {
  public id: number;
  public message: string;
  public name: string;
  public userType: string;
  public isSeen: boolean;
  public messageDate: string;
  public senderId: number;

  constructor(data: IMessage) {
    this.id = data.id;
    this.message = data.message;
    this.name = data.name;
    this.userType = data.userType;
    this.isSeen = data.isSeen;
    this.senderId = data.senderId;
    this.messageDate = data.messageDate;
  }
}

@Injectable({
  providedIn: 'root',
})
export class MessageAdapter {
  public adapt(data: IMessage): Message {
    return new Message(data);
  }
  public adaptArray(dataArray: IMessage[]): Message[] {
    return dataArray.map((data) => this.adapt(data));
  }
}
