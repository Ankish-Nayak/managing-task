import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ICONS } from '../../../shared/icons/icons';
import { ChatBox } from '../../../shared/models/chat-box.model';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago/time-ago.pipe';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { ChatboxService } from '../../../shared/services/chatbox/chatbox.service';
import { SpinnerComponent } from '../../../sharedComponents/spinners/spinner/spinner.component';
import { ChatTab } from '../chat.component';

@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [CommonModule, JsonPipe, TimeAgoPipe, RouterLink, SpinnerComponent],
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss',
})
export class ChatBoxComponent implements OnInit {
  WORD_LIMIT = 30;
  chatboxs!: ChatBox[];
  loggedInUserId!: number;
  @Output() addChatBox = new EventEmitter<ChatTab>();
  isLoading: boolean = false;
  readonly ICONS = ICONS;
  constructor(
    private chatBoxService: ChatboxService,
    private authService: AuthService,
    private datePipe: DatePipe,
  ) {}
  ngOnInit(): void {
    this.authService.userMessageSource.subscribe((res) => {
      if (res) this.loggedInUserId = res.id!;
    });
    this.isLoading = true;
    this.chatBoxService.getChatBox().subscribe(
      (res) => {
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
      },
      (e) => {
        console.log(e);
      },
      () => {
        this.isLoading = false;
      },
    );
  }
  getIsSeen(chatbox: ChatBox) {
    return this.loggedInUserId === chatbox.employeeId;
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
