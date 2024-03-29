import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ClickedDirective } from '../../../../shared/directives/clicked/clicked.directive';
import { ICONS } from '../../../../shared/icons/icons';
import { TEmployee } from '../../../../shared/interfaces/employee.type';
import { GetTodosQueryParams } from '../../../../shared/interfaces/requests/todo.interface';
import { Todo } from '../../../../shared/models/todo.model';
import { UserViewColsPipe } from '../../../../shared/pipes/user-view-cols/user-view-cols.pipe';
import { TCOLS } from '../cols';

@Component({
  selector: '[app-todo-list-header]',
  standalone: true,
  imports: [CommonModule, UserViewColsPipe, ClickedDirective, NgbTooltip],
  templateUrl: './todo-list-header.component.html',
  styleUrl: './todo-list-header.component.scss',
})
export class TodoListHeaderComponent implements OnInit {
  public readonly ICONS = ICONS;
  @Input({ required: true }) public cols!: TCOLS;
  @Input({ required: true }) public userType!: TEmployee;
  @Input({ required: true }) public pageState!: GetTodosQueryParams;
  @Output() clicked: EventEmitter<keyof Todo> = new EventEmitter<keyof Todo>();
  @Output() pageStateChange: EventEmitter<Partial<GetTodosQueryParams>> =
    new EventEmitter<Partial<GetTodosQueryParams>>();
  public sortBy: {
    name: keyof Todo;
    asc: boolean;
  } | null = null;
  ngOnInit(): void {
    if (this.pageState.orderBy.length > 0)
      this.sortBy = {
        name: this.pageState.orderBy as keyof Todo,
        asc: this.pageState.orders === 0 ? true : false,
      };
  }
  public onClicked(name: string) {
    if (name.includes('|')) {
      // up -> 0 -> means asc
      // down -> 1 -> means dsc
      const array = name.split('|');
      const colName = array[0] as keyof Todo;
      if (
        this.sortBy &&
        this.sortBy.name === colName &&
        ((this.sortBy.asc && array.includes('up')) ||
          (!this.sortBy.asc && array.includes('down')))
      ) {
        this.sortBy = null;
      } else {
        this.sortBy = {
          name: colName,
          asc: array.includes('up'),
        };
      }
      if (this.sortBy)
        this.pageStateChange.emit({
          orderBy: this.sortBy.name,
          // orders: array.includes('up') ? 0 : 1,
          orders: this.sortBy.asc ? 0 : 1,
        });
      else {
        this.pageStateChange.emit({
          orderBy: '',
          orders: 0,
        });
      }
    } else {
      this.clicked.emit(name as keyof Todo);
    }
  }
}
