import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatBox } from '../../../shared/models/chat-box.model';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago/time-ago.pipe';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { ChatboxService } from '../../../shared/services/chatbox/chatbox.service';
import { ChatTab } from '../chat.component';

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
  @Output() addChatBox = new EventEmitter<ChatTab>();
  constructor(
    private chatBoxService: ChatboxService,
    private authService: AuthService,
    private datePipe: DatePipe,
  ) {}
  ngOnInit(): void {
    this.authService.userMessageSource.subscribe((res) => {
      if (res) this.loggedInUserId = res.id!;
    });
    this.chatBoxService.getChatBox().subscribe((res) => {
      this.chatboxs = res
        .map((m) => ({
          ...m,
          lastActive: this.datePipe.transform(
            m.lastActive,
            'yyyy-MM-dd HH:mm:ss',
          )!,
        }))
        .filter(
          (m) =>
            !(
              m.recieverId === this.loggedInUserId &&
              m.employeeId === this.loggedInUserId
            ),
        );
      console.log(this.chatboxs);
    });
  }
  getDisplayName(chatbox: ChatBox) {
    if (this.loggedInUserId === chatbox.employeeId) {
      return chatbox.recieverName;
    } else {
      return chatbox.employeeName;
    }
  }
  onAddChatBox(chatbox: ChatBox) {
    if (this.loggedInUserId === chatbox.employeeId) {
      this.addChatBox.emit({
        id: chatbox.recieverId,
        name: chatbox.recieverName,
      });
    } else {
      this.addChatBox.emit({
        id: chatbox.employeeId,
        name: chatbox.employeeName,
      });
    }
  }
}
