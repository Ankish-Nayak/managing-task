import { CommonModule, JsonPipe } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
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
import { MomentTimePipe } from './pipes/moment-time.pipe';

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
    SpinnerComponent,
    MomentTimePipe,
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
    private elementRef: ElementRef,
    private renderer: Renderer2,
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
      const scrollIcon =
        this.elementRef.nativeElement.querySelector('#scrollToDown');
      if (
        scrollableDiv &&
        scrollableDiv.scrollHeight - scrollableDiv.scrollTop >
          scrollableDiv.clientHeight
      ) {
        this.renderer.removeClass(scrollIcon, 'invisible');
      } else {
        this.renderer.addClass(scrollIcon, 'invisible');
      }
    });
  }
  renderDateChip(i: number, messages: Message[]) {
    if (messages.length > 0) {
      if (i > 0) {
        return (
          new Date(messages[i].messageDate).getDate() !==
          new Date(messages[i - 1].messageDate).getDate()
        );
      } else if (i === 0 || messages.length === 1) {
        return true;
      }
    }
    return false;
  }
  onScrollToDown() {
    setTimeout(() => {
      const scrollableContainer =
        this.elementRef.nativeElement.querySelector('#scrollContainer');
      scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
    });
  }
}