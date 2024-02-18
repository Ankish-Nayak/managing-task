import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SpinnerComponent } from '../../../shared/components/spinners/spinner/spinner.component';
import { ICONS } from '../../../shared/icons/icons';
import { ChatBox } from '../../../shared/models/chat-box.model';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago/time-ago.pipe';
import { AuthService } from '../../../shared/services/auth/auth.service';
import {
  ChatTab,
  ChatboxService,
} from '../../../shared/services/chatbox/chatbox.service';

@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [CommonModule, JsonPipe, TimeAgoPipe, RouterLink, SpinnerComponent],
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss',
})
export class ChatBoxComponent implements OnInit {
  public WORD_LIMIT = 30;
  public chatboxs!: ChatBox[];
  public loggedInUserId!: number;
  @Output() addChatBox = new EventEmitter<ChatTab>();
  public isLoading: boolean = false;
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
    this.chatBoxService.getChatBox().subscribe({
      next: (res) => {
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
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
  public getIsSeen(chatbox: ChatBox) {
    return this.loggedInUserId === chatbox.employeeId;
  }
  public getDisplayName(chatbox: ChatBox) {
    if (this.loggedInUserId === chatbox.employeeId) {
      return chatbox.recieverName;
    } else {
      return chatbox.employeeName;
    }
  }
  public onAddChatBox(chatbox: ChatBox) {
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
