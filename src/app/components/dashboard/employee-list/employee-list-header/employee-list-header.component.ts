import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClickedDirective } from '../../../../shared/directives/clicked/clicked.directive';
import { Employee } from '../../../../shared/models/employee.model';
import { COLS, TCOLS } from '../cols';
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
export class EmployeeListHeaderComponent implements OnInit {
  @Input({ required: true }) cols!: TCOLS;
  @Input({ required: true }) pageState!: GetEmployeesQueryParams;
  @Output() pageStateChange = new EventEmitter<
    Partial<GetEmployeesQueryParams>
  >();
  @Input({ required: true }) renderIcons!: boolean;
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
  ngOnInit(): void {
    if (this.pageState.orderBy.length > 0)
      this.sortBy = {
        name: this.pageState.orderBy as keyof Employee,
        asc: this.pageState.orders === 0 ? true : false,
      };
    console.log('sortby', this.sortBy);
  }
  onClicked(name: string) {
    // console.log(name);
    if (name.includes('|')) {
      // up -> 0 -> means asc
      // down -> 1 -> means dsc
      const array = name.split('|');
      const colName = array[0] as keyof Employee;
      // console.log(colName);
      // console.log('sortBy', this.sortBy);
      if (
        this.sortBy &&
        this.sortBy.name === colName &&
        ((this.sortBy.asc && array.includes('up')) ||
          (!this.sortBy.asc && array.includes('down')))
      ) {
        // console.log('has to toggle it');
        this.sortBy = null;
      } else {
        this.sortBy = {
          name: colName,
          asc: array.includes('up'),
        };
      }

      // console.log(this.sortBy);
      if (this.sortBy)
        this.pageStateChange.emit({
          orderBy: this.sortBy.name,
          orders: this.sortBy.asc ? 0 : 1,
        });
      else {
        this.pageStateChange.emit({
          orderBy: '',
          orders: 0,
        });
      }
    } else {
      // this.clicked.emit(name as keyof Employee);
    }
  }
}
