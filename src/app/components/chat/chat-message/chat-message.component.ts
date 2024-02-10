import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Message, MessageAdapter } from '../../../shared/models/message.model';
import { conversationData, loggedInuserId, senderId } from './mock';
import { CommonModule, JsonPipe } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatboxService } from '../../../shared/services/chatbox/chatbox.service';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { ClickedEnterDirective } from '../../../shared/directives/clicked-enter/clicked-enter.directive';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago/time-ago.pipe';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [
    JsonPipe,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClickedEnterDirective,
    TimeAgoPipe,
  ],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
})
export class ChatMessageComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  isLoading = true;
  messages!: Message[];
  senderMessage: string = '';
  senderId!: number;
  loggedInuserId!: number;
  chatForm!: FormGroup;
  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef;
  constructor(
    private chatMessageAdapter: MessageAdapter,
    private router: Router,
    private route: ActivatedRoute,
    private chatboxService: ChatboxService,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {}
  ngOnInit(): void {
    this.chatForm = new FormGroup({
      message: new FormControl(['']),
    });
    this.getSenderId();
    this.getLoggedInUserId();
    this.getDisplayMessage();
  }
  ngAfterViewInit(): void {
    // this.scrollToBottom();
  }
  ngAfterViewChecked(): void {}

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
    const { message } = this.chatForm.value;
    if (message.length > 0)
      this.chatboxService
        .sendMessage(this.senderId, { message: this.senderMessage })
        .subscribe((res) => {
          this.senderMessage = '';
          this.getDisplayMessage();
        });
  }
  onInputChange() {}
}
