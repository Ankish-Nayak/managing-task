import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChatBox, ChatBoxAdapter } from '../../../shared/models/chat-box.model';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago/time-ago.pipe';
import { ChatboxService } from '../../../shared/services/chatbox/chatbox.service';
import { RouterLink } from '@angular/router';
import { END_POINTS } from '../../../utils/constants';
import { AuthService } from '../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [CommonModule, JsonPipe, TimeAgoPipe, RouterLink],
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss',
})
export class ChatBoxComponent implements OnInit {
  chatboxs!: ChatBox[];
  loggedInUserId!: number;
  constructor(
    private chatBoxService: ChatboxService,
    private chatboxAdpater: ChatBoxAdapter,
    private authService: AuthService,
  ) {}
  ngOnInit(): void {
    // this.chatboxs = this.chatboxAdpater.adaptArray(chatBoxDataArray);
    this.authService.userMessageSource.subscribe((res) => {
      if (res) this.loggedInUserId = res.id!;
    });
    this.chatBoxService.getChatBox().subscribe((res) => {
      this.chatboxs = res;
    });
  }
  getRouterLink(chatbox: ChatBox) {
    // we sent message
    if (this.loggedInUserId === chatbox.employeeId) {
      return [`../${END_POINTS.message}/${chatbox.recieverId}`];
    }
    return [`../${END_POINTS.message}/${chatbox.employeeId}`];
  }
}
