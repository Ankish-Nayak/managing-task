import { Component, OnInit } from '@angular/core';
import { ChatboxService } from '../../../shared/services/chatbox/chatbox.service';
import { ChatBox, ChatBoxAdapter } from '../../../shared/models/chat-box.model';
import { CommonModule, JsonPipe } from '@angular/common';
import { chatBoxDataArray } from './mock';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago/time-ago.pipe';

@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [CommonModule, JsonPipe, TimeAgoPipe],
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss',
})
export class ChatBoxComponent implements OnInit {
  chatboxs!: ChatBox[];
  constructor(
    private chatBoxService: ChatboxService,
    private chatboxAdpater: ChatBoxAdapter,
  ) {}
  ngOnInit(): void {
    this.chatboxs = this.chatboxAdpater.adaptArray(chatBoxDataArray);
    // this.chatBoxService.getChatBox().subscribe((res) => {
    //   this.chatboxs = res;
    // });
  }
}
