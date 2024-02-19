import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ClickedDirective } from '../../../../shared/directives/clicked/clicked.directive';
import { ICONS } from '../../../../shared/icons/icons';
import { GetEmployeesQueryParams } from '../../../../shared/interfaces/requests/employee.interface';
import { Employee } from '../../../../shared/models/employee.model';
import { TCOLS } from '../cols';

type TWidth = { [key in keyof Employee]?: string };
@Component({
  selector: '[app-employee-list-header]',
  standalone: true,
  imports: [CommonModule, ClickedDirective, NgbTooltipModule],
  templateUrl: './employee-list-header.component.html',
  styleUrl: './employee-list-header.component.scss',
})
export class EmployeeListHeaderComponent implements OnInit {
  readonly widths: TWidth = {
    name: '10%',
    address: '15%',
    city: '15%',
  };
  readonly ICONS = ICONS;
  @Input({ required: true }) cols!: TCOLS;
  @Input({ required: true }) pageState!: GetEmployeesQueryParams;
  @Input({ required: true }) renderIcons!: boolean;
  @Output() pageStateChange = new EventEmitter<
    Partial<GetEmployeesQueryParams>
  >();
  protected sortBy: {
    name: keyof Employee;
    asc: boolean;
  } | null = null;

  ngOnInit(): void {
    if (this.pageState.orderBy.length > 0)
      this.sortBy = {
        name: this.pageState.orderBy as keyof Employee,
        asc: this.pageState.orders === 0 ? true : false,
      };
  }
  public onClicked(name: string) {
    if (name.includes('|')) {
      // up -> 0 -> means asc
      // down -> 1 -> means dsc
      const array = name.split('|');
      const colName = array[0] as keyof Employee;
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
