import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ClickedDirective } from '../../../../shared/directives/clicked/clicked.directive';
import { COLS } from '../cols';

@Component({
  selector: '[app-employee-list-header]',
  standalone: true,
  imports: [CommonModule, ClickedDirective],
  templateUrl: './employee-list-header.component.html',
  styleUrl: './employee-list-header.component.scss',
})
export class EmployeeListHeaderComponent {
  readonly cols = COLS;
  @Output() clicked: EventEmitter<string> = new EventEmitter<string>();
  constructor() {}
  onClicked(name: string) {
    this.clicked.emit(name);
    console.log(name);
  }
}
