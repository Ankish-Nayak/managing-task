import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FrameComponent } from '../../sharedComponents/containers/frame/frame.component';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, FrameComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent {}
