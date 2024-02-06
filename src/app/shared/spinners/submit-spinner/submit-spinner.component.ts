import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-submit-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './submit-spinner.component.html',
  styleUrl: './submit-spinner.component.scss',
})
export class SubmitSpinnerComponent {
  @Input({ required: true }) isSubmitLoading!: boolean;
}
