import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbPopover, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ClickedDirective } from '../../../../shared/directives/clicked/clicked.directive';
import { TEmployee } from '../../../../shared/interfaces/employee.type';
import { Todo } from '../../../../shared/models/todo.model';
import { UserViewColsPipe } from '../../../../shared/pipes/user-view-cols/user-view-cols.pipe';
import { TCOLS } from '../cols';
import { ICONS } from '../../../../shared/icons/icons';
import { GetTodosQueryParams } from '../../../../shared/interfaces/requests/toto.interface';

type TsortBy = keyof Todo | null;
@Component({
  selector: '[app-todo-list-header]',
  standalone: true,
  imports: [
    CommonModule,
    UserViewColsPipe,
    ClickedDirective,
    NgbPopover,
    NgbTooltip,
  ],
  templateUrl: './todo-list-header.component.html',
  styleUrl: './todo-list-header.component.scss',
})
export class TodoListHeaderComponent {
  @Input({ required: true }) cols!: TCOLS;
  @Input({ required: true }) userType!: TEmployee;
  @Input({ required: true }) pageState!: GetTodosQueryParams;
  @Output() clicked: EventEmitter<keyof Todo> = new EventEmitter<keyof Todo>();
  @Output() pageStateChange: EventEmitter<Partial<GetTodosQueryParams>> =
    new EventEmitter<Partial<GetTodosQueryParams>>();
  readonly ICONS = ICONS;
  sortBy: {
    name: keyof Todo;
    asc: boolean;
  } | null = null;
  onClicked(name: string) {
    if (name.includes('|')) {
      // up -> 0 -> means asc
      // down -> 1 -> means dsc
      const array = name.split('|');
      const colName = array[0] as keyof Todo;
      this.sortBy = {
        name: colName,
        asc: array.includes('up'),
      };
      console.log(this.sortBy);
      this.pageStateChange.emit({
        orderBy: colName,
        orders: array.includes('up') ? 0 : 1,
      });
    } else {
      this.clicked.emit(name as keyof Todo);
    }
  }
  isFilled(colName: keyof Todo | null, name: 'up' | 'down', isFilled: boolean) {
    if (this.sortBy === null) {
      return !isFilled;
    }
    return (
      colName !== null &&
      this.sortBy.name === colName &&
      ((this.sortBy.asc && name === 'up') ||
        (!this.sortBy.asc && name === 'down'))
    );
  }
}
