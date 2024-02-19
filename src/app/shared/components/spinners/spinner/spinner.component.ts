import { Component, Input } from '@angular/core';

type BootstrapTextColors =
  | 'text-primary'
  | 'text-secondary'
  | 'text-success'
  | 'text-danger'
  | 'text-warning'
  | 'text-info'
  | 'text-light'
  | 'text-dark'
  | 'text-body'
  | 'text-muted'
  | 'text-white';
@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {
  @Input() color: BootstrapTextColors = 'text-dark';
  public classArray: string[] = ['spinner-border'];
}
