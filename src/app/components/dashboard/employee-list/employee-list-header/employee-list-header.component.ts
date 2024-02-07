import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ClickedDirective } from '../../../../shared/directives/clicked/clicked.directive';
import { Employee } from '../../../../shared/models/employee.model';
import { COLS } from '../cols';

type TWidth = { [key in keyof Employee]?: string };
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
  readonly widths: TWidth = {
    name: '10%',
    address: '15%',
    city: '15%',
  };
  constructor() {}
  onClicked(name: string) {
    this.clicked.emit(name);
    console.log(name);
  }
}
