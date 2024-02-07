import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClickedDirective } from '../../../../shared/directives/clicked/clicked.directive';
import { Employee } from '../../../../shared/models/employee.model';
import { COLS } from '../cols';
import { GetEmployeesQueryParams } from '../../../../shared/interfaces/requests/employee.interface';
import { ICONS } from '../../../../shared/icons/icons';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

type TWidth = { [key in keyof Employee]?: string };
@Component({
  selector: '[app-employee-list-header]',
  standalone: true,
  imports: [CommonModule, ClickedDirective, NgbTooltipModule],
  templateUrl: './employee-list-header.component.html',
  styleUrl: './employee-list-header.component.scss',
})
export class EmployeeListHeaderComponent {
  readonly cols = COLS;
  @Output() clicked: EventEmitter<string> = new EventEmitter<string>();
  @Input({ required: true }) pageState!: GetEmployeesQueryParams;
  @Output() pageStateChange = new EventEmitter<
    Partial<GetEmployeesQueryParams>
  >();
  readonly widths: TWidth = {
    name: '10%',
    address: '15%',
    city: '15%',
  };
  sortBy: {
    name: keyof Employee;
    asc: boolean;
  } | null = null;
  readonly ICONS = ICONS;
  constructor() {}
  // onClicked(name: string) {
  //   this.clicked.emit(name);
  //   console.log(name);
  // }
  onClicked(name: string) {
    console.log(name);
    if (name.includes('|')) {
      // up -> 0 -> means asc
      // down -> 1 -> means dsc
      const array = name.split('|');
      const colName = array[0] as keyof Employee;
      console.log(colName);
      console.log('sortBy', this.sortBy);
      if (
        this.sortBy &&
        this.sortBy.name === colName &&
        ((this.sortBy.asc && array.includes('up')) ||
          (!this.sortBy.asc && array.includes('down')))
      ) {
        console.log('has to toggle it');
        this.sortBy = null;
      } else {
        this.sortBy = {
          name: colName,
          asc: array.includes('up'),
        };
      }

      console.log(this.sortBy);
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
      this.clicked.emit(name as keyof Employee);
    }
  }
  isFilled(
    colName: keyof Employee | null,
    name: 'up' | 'down',
    isFilled: boolean,
  ) {
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
