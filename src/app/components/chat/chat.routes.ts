import { Routes } from '@angular/router';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { END_POINTS } from '../../utils/constants';

export const routes: Routes = [
  {
    component: ChatBoxComponent,
    path: END_POINTS.chatBox,
  },
  {
    component: ChatMessageComponent,
    path: END_POINTS.message,
  },
  {
    component: ChatMessageComponent,
    path: END_POINTS.messageToSomeone,
  },
];
