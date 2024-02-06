import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HighlightDirective } from '../../../shared/directives/highlight/highlight.directive';
import { ICONS } from '../../../shared/icons/icons';
import { GetEmployeesQueryParams } from '../../../shared/interfaces/requests/employee.interface';
import { ConfirmationModalComponent } from '../../../shared/modals/confirmation-modal/confirmation-modal.component';
import {
  Employee,
  EmployeeAdapter,
} from '../../../shared/models/employee.model';
import { EmployeeService } from '../../../shared/services/employee/employee.service';
import { EmployeeListHeaderComponent } from './employee-list-header/employee-list-header.component';
import { EmployeeComponent } from './employee/employee.component';

//TODO: add placeholder on every small element which exists like employee todo and alll to make this
//much better

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    ConfirmationModalComponent,
    EmployeeComponent,
    HighlightDirective,
    EmployeeListHeaderComponent,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent implements OnInit {
  employees!: Employee[];
  isLoading: boolean = true;
  employeeToBeDeletedID: number | null = null;
  pageState = new GetEmployeesQueryParams({});
  readonly ICONS = ICONS;
  constructor(
    private employeeService: EmployeeService,
    private employeeAdapter: EmployeeAdapter,
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.getEmployeesByDepartment(Number(id));
      } else {
        this.getEmployees();
      }
    });
  }
  getEmployeesByDepartment(id: number) {
    this.isLoading = true;
    this.employeeService.getEmployeesByDepartment(id).subscribe((res) => {
      this.employees = this.employeeAdapter.adaptArray(res.iterableData);
      this.isLoading = false;
    });
  }
  getEmployees() {
    this.isLoading = true;
    this.employeeService.getEmployees(this.pageState).subscribe((res) => {
      this.employees = this.employeeAdapter.adaptArray(res.iterableData);
      this.isLoading = false;
    });
  }
  confirm(confirmation: boolean) {
    if (confirmation && this.employeeToBeDeletedID !== null) {
      this.employeeService
        .deleteEmployee(this.employeeToBeDeletedID)
        .subscribe(() => {
          this.getEmployees();
        });
    }
  }
  onViewEmployeesByDepartment(id: number) {}
  print() {
    console.log('enter');
  }
  delete(id: number) {
    this.employeeToBeDeletedID = id;
  }
  onClicked(name: string) {
    this.employeeService
      .getEmployees({
        orderBy: name,
        orders: 1,
      })
      .subscribe((res) => {
        this.employees = res.iterableData;
      });
  }
  onAssignTask(id: number) {
    this.router.navigate([`../assign-task/${id}`], {
      relativeTo: this.route,
      replaceUrl: true,
    });
  }
}
