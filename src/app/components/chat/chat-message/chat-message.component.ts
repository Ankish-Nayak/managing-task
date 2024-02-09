import { Component, OnInit } from '@angular/core';
import { Message, MessageAdapter } from '../../../shared/models/message.model';
import { conversationData, loggedInuserId, senderId } from './mock';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatboxService } from '../../../shared/services/chatbox/chatbox.service';
import { AuthService } from '../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [JsonPipe, CommonModule, FormsModule],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
})
export class ChatMessageComponent implements OnInit {
  isLoading = true;
  messages!: Message[];
  senderMessage: string = '';
  senderId!: number;
  loggedInuserId!: number;
  constructor(
    private chatMessageAdapter: MessageAdapter,
    private router: Router,
    private route: ActivatedRoute,
    private chatboxService: ChatboxService,
    private authService: AuthService,
  ) {}
  ngOnInit(): void {
    this.getSenderId();
    this.getLoggedInUserId();
    this.getDisplayMessage();
  }

  getMockData() {
    this.senderId = Number(senderId);
    this.loggedInuserId = Number(loggedInuserId);
    this.messages = this.chatMessageAdapter.adaptArray(conversationData);
  }
  getLoggedInUserId() {
    this.authService.userMessageSource.subscribe((res) => {
      console.log(res);
      if (res) this.loggedInuserId = res.id;
    });
  }
  getSenderId() {
    return this.route.paramMap.subscribe((params) => {
      const senderId = params.get('senderId');
      if (senderId) {
        this.senderId = Number(senderId);
      }
    });
  }
  isLoggedInUserMessage(message: Message) {
    const boolean = message.senderId === this.loggedInuserId;
    console.log('message', this.loggedInuserId, message.senderId, boolean);
    return message.senderId === this.loggedInuserId;
  }
  getDisplayMessage() {
    this.isLoading = true;
    this.chatboxService.displayMessage(this.senderId).subscribe(
      (res) => {
        this.messages = res;
      },
      () => {},
      () => {
        this.isLoading = false;
      },
    );
  }
  sendMessage() {
    this.chatboxService
      .sendMessage(this.senderId, { message: this.senderMessage })
      .subscribe((res) => {
        this.getDisplayMessage();
      });
  }
  onInputChange() {}
}
