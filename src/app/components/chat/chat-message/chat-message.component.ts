import { Component, OnInit } from '@angular/core';
import { Message, MessageAdapter } from '../../../shared/models/message.model';
import { conversationData } from './mock';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [JsonPipe, CommonModule, FormsModule],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
})
export class ChatMessageComponent implements OnInit {
  messages!: Message[];
  senderMessage: string = '';
  constructor(private chatMessageAdapter: MessageAdapter) {}
  ngOnInit(): void {
    this.messages = this.chatMessageAdapter.adaptArray(conversationData);
  }
  onInputChange() {}
}
