import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClickedDirective } from '../../../../shared/directives/clicked/clicked.directive';
import { TEmployee } from '../../../../shared/interfaces/employee.type';
import { UserViewColsPipe } from '../../../../shared/pipes/user-view-cols/user-view-cols.pipe';
import { TCOLS } from '../cols';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: '[app-todo-list-header]',
  standalone: true,
  imports: [CommonModule, UserViewColsPipe, ClickedDirective, NgbPopover],
  templateUrl: './todo-list-header.component.html',
  styleUrl: './todo-list-header.component.scss',
})
export class TodoListHeaderComponent {
  @Input({ required: true }) cols!: TCOLS;
  @Input({ required: true }) userType!: TEmployee;
  @Output() clicked: EventEmitter<string> = new EventEmitter<string>();
  onClicked(name: string) {
    console.log(name);
    this.clicked.emit(name);
  }
}
