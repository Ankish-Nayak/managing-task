import { Routes } from '@angular/router';
import { ChatComponent } from './chat.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';

export const routes: Routes = [
  {
    component: ChatBoxComponent,
    path: 'chat-box',
  },
  {
    component: ChatMessageComponent,
    path: 'message',
  },
];
