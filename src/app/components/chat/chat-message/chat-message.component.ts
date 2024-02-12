import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Message, MessageAdapter } from '../../../shared/models/message.model';
import { conversationData, loggedInuserId, senderId } from './mock';
import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
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
import { ICONS } from '../../../shared/icons/icons';

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
    DatePipe,
  ],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
})
export class ChatMessageComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnChanges
{
  readonly ICONS = ICONS;
  isLoading = false;
  isSubmitLoading = false;
  messages!: Message[];
  senderMessage: string = '';
  @Input({ required: true }) senderId!: number;
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
    private datePipe: DatePipe,
  ) {}
  ngOnInit(): void {
    this.chatForm = new FormGroup({
      message: new FormControl(['']),
    });
    // this.getSenderId();
    this.getLoggedInUserId();
    this.getDisplayMessage();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.getLoggedInUserId();
      this.getDisplayMessage();
    }
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
    return message.senderId === this.loggedInuserId;
  }
  getDisplayMessage() {
    this.isLoading = true;
    this.chatboxService.displayMessage(this.senderId).subscribe(
      (res) => {
        this.messages = res.map((m) => ({
          ...m,
          messageDate: this.datePipe.transform(
            m.messageDate,
            'yyyy-MM-ddTHH:mm:ss.SSSZ',
            '+0530',
          )!,
        }));
      },
      () => {},
      () => {
        this.isLoading = false;
      },
    );
  }
  sendMessage() {
    if (this.isSubmitLoading) {
      return;
    }
    const { message } = this.chatForm.value;
    if (message.length > 0) {
      this.isSubmitLoading = true;
      this.chatboxService
        .sendMessage(this.senderId, { message: this.senderMessage })
        .subscribe(
          () => {
            this.senderMessage = '';
            this.getDisplayMessage();
          },
          (e) => {
            console.log(e);
          },
          () => {
            this.isSubmitLoading = false;
          },
        );
    }
  }
  onInputChange() {}
  deleteMessage(id: number) {
    this.chatboxService.deleteMessage(id).subscribe((res) => {
      this.getDisplayMessage();
    });
  }
  convertedIST() {}
}
