import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClickedEnterDirective } from '../../../shared/directives/clicked-enter/clicked-enter.directive';
import { ICONS } from '../../../shared/icons/icons';
import { Message, MessageAdapter } from '../../../shared/models/message.model';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago/time-ago.pipe';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { ChatboxService } from '../../../shared/services/chatbox/chatbox.service';
import { SpinnerComponent } from '../../../sharedComponents/spinners/spinner/spinner.component';
import { conversationData, loggedInuserId, senderId } from './mock';

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
    SpinnerComponent,
  ],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
})
export class ChatMessageComponent implements OnInit, OnChanges {
  readonly ICONS = ICONS;
  isLoading = false;
  isSubmitLoading = false;
  messages!: Message[];
  senderMessage: string = '';
  @Input({ required: true }) senderId!: number;
  loggedInuserId!: number;
  chatForm!: FormGroup;
  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef;
  idToBeDeleted: null | number = null;
  constructor(
    private chatMessageAdapter: MessageAdapter,
    private route: ActivatedRoute,
    private chatboxService: ChatboxService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private elementRef: ElementRef,
  ) {}
  ngOnInit(): void {
    this.chatForm = new FormGroup({
      message: new FormControl(['']),
    });
    this.getLoggedInUserId();
    this.getDisplayMessage();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.getLoggedInUserId();
      this.getDisplayMessage();
    }
  }
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
    return message.senderId === this.loggedInuserId;
  }
  getDisplayMessage() {
    this.isLoading = true;
    this.chatboxService.displayMessage(this.senderId).subscribe(
      (res) => {
        // this.messages = res.map((m) => ({
        //   ...m,
        //   messageDate: this.datePipe.transform(
        //     m.messageDate,
        //     'yyyy-MM-ddTHH:mm:ss.SSSZ',
        //     '+0530',
        //   )!,
        // }));
        this.messages = res;
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
            this.udpateDisplayMessage();
            // this.getDisplayMessage();
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
  udpateDisplayMessage() {
    this.chatboxService.displayMessage(this.senderId).subscribe((res) => {
      const newMessages: Message[] = res;
      this.messages.push(...newMessages);
    });
  }
  trackById(_index: number, message: Message) {
    return message.id;
  }

  onInputChange() {}
  deleteMessage(id: number) {
    if (this.idToBeDeleted) {
      return;
    }
    this.idToBeDeleted = id;
    this.chatboxService.deleteMessage(id).subscribe(() => {
      this.idToBeDeleted = null;
      this.messages = this.messages.filter((m) => m.id !== id);
    });
  }
  onScroll() {
    setTimeout(() => {
      const scrollableDiv =
        this.elementRef.nativeElement.querySelector('#scrollContainer');
      if (
        scrollableDiv &&
        scrollableDiv.scrollHeight - scrollableDiv.scrollTop >=
          scrollableDiv.clientHeight
      ) {
        console.log('show icons');
      }
    });
  }
}
