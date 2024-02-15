import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiEvent, EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, EmojiModule, PickerComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent {
  listEmojis: string[] = [];
  addEmoji(e: EmojiEvent) {
    const selectedEmoji = e.emoji.native;
    this.listEmojis.push(selectedEmoji!);
  }
}
