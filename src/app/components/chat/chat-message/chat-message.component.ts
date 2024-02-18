import { CommonModule, JsonPipe } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Subscription } from 'rxjs';
import { SpinnerComponent } from '../../../shared/components/spinners/spinner/spinner.component';
import { ClickedEnterDirective } from '../../../shared/directives/clicked-enter/clicked-enter.directive';
import { LongPressDirective } from '../../../shared/directives/longPress/long-press.directive';
import { ICONS } from '../../../shared/icons/icons';
import { GetDisplayMessageQueryParams } from '../../../shared/interfaces/requests/chatbox.interface';
import { Message, MessageAdapter } from '../../../shared/models/message.model';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago/time-ago.pipe';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { ChatboxService } from '../../../shared/services/chatbox/chatbox.service';
import { conversationData, loggedInuserId, senderId } from './mock';
import { MomentTimePipe } from './pipes/moment-time.pipe';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [
    SpinnerComponent,
    JsonPipe,
    PickerComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClickedEnterDirective,
    TimeAgoPipe,
    SpinnerComponent,
    MomentTimePipe,
    LongPressDirective,
  ],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
})
export class ChatMessageComponent
  implements OnInit, OnChanges, AfterViewChecked, AfterViewInit
{
  public deletingMultipleMessages: boolean = false;
  public selectedIdsToBeDeleted: number[] = [];
  public deletingMultipleMessagesLoading: boolean = false;
  readonly ICONS = ICONS;
  public isLoading = false;
  private isSubmitLoading = false;
  public messages!: Message[];
  public senderMessage: string = '';
  @Input({ required: true }) senderId!: number;
  private loggedInuserId!: number;
  public chatForm!: FormGroup;
  private pageState: GetDisplayMessageQueryParams =
    new GetDisplayMessageQueryParams({
      isPagination: true,
      index: 0,
      take: 10,
    });
  sendMessageSubscription: Subscription | undefined;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  public idToBeDeleted: null | number = null;
  public isLoadingMoreData: boolean = false;
  private isNoMoreData: boolean = false;
  private toBottom: boolean = true;
  showEmoji: boolean = false;
  constructor(
    private chatMessageAdapter: MessageAdapter,
    private chatboxService: ChatboxService,
    private authService: AuthService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {}
  ngOnInit(): void {
    this.getLoggedInUserId();
    this.getDisplayMessage();
  }
  ngAfterViewChecked(): void {
    if (this.toBottom) {
      this.scrollToBottom();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.getLoggedInUserId();
      this.getDisplayMessage();
      this.isNoMoreData = false;
    }
  }
  ngAfterViewInit(): void {
    this.scrollToBottom();
    // this.toBottom = true;
  }
  public getMockData() {
    this.senderId = Number(senderId);
    this.loggedInuserId = Number(loggedInuserId);
    this.messages = this.chatMessageAdapter.adaptArray(conversationData);
  }
  private getLoggedInUserId() {
    this.authService.userMessageSource.subscribe((res) => {
      if (res) this.loggedInuserId = res.id;
    });
  }
  public isLoggedInUserMessage(message: Message) {
    return message.senderId === this.loggedInuserId;
  }
  private getDisplayMessage() {
    this.isLoading = true;
    this.chatboxService
      .displayMessage(this.senderId, this.pageState)
      .subscribe({
        next: (res) => {
          this.messages = res;
        },
        error: () => {},
        complete: () => {
          this.isLoading = false;
          this.toBottom = true;
        },
      });
  }
  public sendMessage() {
    if (this.isSubmitLoading) {
      return;
    }
    const message = this.senderMessage;
    // const { message } = this.chatForm.value;
    if (message.length > 0) {
      this.isSubmitLoading = true;
      this.sendMessageSubscription = this.chatboxService
        .sendMessage(this.senderId, { message: this.senderMessage })
        .subscribe({
          next: () => {
            this.senderMessage = '';
            this.udpateDisplayMessage();
            // this.getDisplayMessage();
          },
          error: (e) => {
            console.log(e);
          },
          complete: () => {
            this.isSubmitLoading = false;
            this.toBottom = true;
          },
        });
    }
  }

  private udpateDisplayMessage() {
    this.chatboxService
      .displayMessage(this.senderId, this.pageState)
      .subscribe({
        next: (res) => {
          const diff = res.filter((n) => {
            return this.messages.findIndex((m) => n.id === m.id) === -1;
          });
          this.messages.push(...diff);
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {},
      });
  }
  public trackById(_index: number, message: Message) {
    return message.id;
  }

  public deleteMessage(id: number) {
    if (this.idToBeDeleted) {
      return;
    }
    this.idToBeDeleted = id;
    this.chatboxService.deleteMessage(id).subscribe(() => {
      this.idToBeDeleted = null;
      this.messages = this.messages.filter((m) => m.id !== id);
    });
  }
  public onScroll(event: any) {
    if (this.isLoadingMoreData) {
      event.preventDefault();
    }
    if (this.toBottom) {
      this.toBottom = false;
    }

    const scrollableElement = event.target as HTMLElement;
    // const scrollableDiv =
    //   this.elementRef.nativeElement.querySelector('#scrollContainer');

    // const scrollableDiv =
    //   this.scrollContainer.nativeElement.querySelector('#scrollContainer');
    if (!this.isNoMoreData && !this.isLoadingMoreData) {
      setTimeout(() => {
        const scrollTop = scrollableElement.scrollTop;
        const scrollHeight = scrollableElement.scrollHeight;

        const twentyPercentScrollHeight = scrollHeight * 0.2;
        if (scrollTop <= twentyPercentScrollHeight) {
          this.loadMore();
        }
      });
    }

    // showing down icon
    setTimeout(() => {
      const scrollIcon =
        this.elementRef.nativeElement.querySelector('#scrollToDown');
      if (
        scrollableElement &&
        scrollableElement.scrollHeight - scrollableElement.scrollTop >
          scrollableElement.clientHeight
      ) {
        this.renderer.removeClass(scrollIcon, 'invisible');
      } else {
        this.renderer.addClass(scrollIcon, 'invisible');
      }
    });
  }
  public renderDateChip(i: number, messages: Message[]) {
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
  public onScrollToDown() {
    setTimeout(() => {
      const scrollableContainer = this.scrollContainer
        .nativeElement as HTMLElement;

      this.renderer.setStyle(scrollableContainer, 'scroll-behavior', 'smooth');
      scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
    });
  }
  private loadMore() {
    if (this.isLoadingMoreData) {
      return;
    }
    this.isLoadingMoreData = true;
    let tempIndex = this.messages.length / this.pageState.take;
    if (tempIndex % 1 === 0 && tempIndex !== 1) {
      tempIndex++;
    }
    const nextIndex = Math.floor(tempIndex);
    this.chatboxService
      .displayMessage(this.senderId, {
        ...this.pageState,
        index: nextIndex,
      })
      .subscribe({
        next: (res) => {
          const diff = res.filter((n) => {
            return this.messages.findIndex((m) => m.id === n.id) === -1;
          });
          if (diff.length === 0) {
            this.isNoMoreData = true;
          }
          this.messages.unshift(...diff);
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {
          this.isLoadingMoreData = false;
        },
      });
  }
  public toggleEmoji() {
    this.showEmoji = !this.showEmoji;
  }
  public addEmoji(e: EmojiEvent) {
    e.$event.preventDefault();
    this.senderMessage = this.senderMessage + ' ' + e.emoji.native;
  }
  public scrollToBottom() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    }
  }
  public onLongPress() {
    this.selectedIdsToBeDeleted = [];
    this.deletingMultipleMessages = true;
  }
  public toggleIdToBeDeleted(message: Message, e: MouseEvent) {
    e.preventDefault();
    if (this.selectedIdsToBeDeleted.includes(message.id)) {
      this.selectedIdsToBeDeleted = this.selectedIdsToBeDeleted.filter(
        (n) => n !== message.id,
      );
    } else {
      this.selectedIdsToBeDeleted.push(message.id);
    }
  }
  public deleteSeletedIds() {
    this.deletingMultipleMessagesLoading = true;
    this.chatboxService.deleteMessages(this.selectedIdsToBeDeleted).subscribe({
      next: () => {
        this.messages = this.messages.filter(
          (m) => !this.selectedIdsToBeDeleted.includes(m.id),
        );
        this.selectedIdsToBeDeleted = [];
        this.deletingMultipleMessages = false;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.deletingMultipleMessagesLoading = false;
      },
    });
  }
  public cancelSelection() {
    this.deletingMultipleMessages = false;
    this.selectedIdsToBeDeleted = [];
  }
}
