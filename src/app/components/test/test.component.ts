import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FrameComponent } from '../../sharedComponents/containers/frame/frame.component';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, FrameComponent, ChatComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent {
  showChat: boolean = true;
  onCloseFrame() {
    this.showChat = false;
  }
  openFrame() {
    this.showChat = true;
  }
}
