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
import { END_POINTS, LocalStorageKeys } from '../../../utils/constants';
import { PaginationComponent } from '../../../shared/paginations/pagination/pagination.component';

import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '../../../utils/localStorageCRUD';
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
    PaginationComponent,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent implements OnInit {
  employees!: Employee[];
  isLoading: boolean = true;
  employeeToBeDeletedID: number | null = null;
  pageState = new GetEmployeesQueryParams(
    (() => {
      const data = getLocalStorageItem(LocalStorageKeys.GetEmployees);
      if (data) {
        return JSON.parse(data);
      } else {
        return {
          isPagination: true,
          index: 0,
          take: 10,
          isCompleted: null,
        };
      }
    })(),
  );
  totalPagesCount: number = 0;
  employeeId: string | null = null;
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
      this.employeeId = id;
      this.getEmployees();
    });
  }
  getEmployeesByDepartment(id: number) {
    this.isLoading = true;
  }
  getEmployees() {
    this.isLoading = true;
    if (this.employeeId) {
      this.employeeService
        .getEmployeesByDepartment(Number(this.employeeId), this.pageState)
        .subscribe((res) => {
          this.employees = this.employeeAdapter.adaptArray(res.iterableData);
          this.totalPagesCount = res.count;
          this.isLoading = false;
          setLocalStorageItem(
            LocalStorageKeys.GetEmployees,

            JSON.stringify(this.pageState),
          );
        });
    } else {
      this.employeeService.getEmployees(this.pageState).subscribe((res) => {
        this.employees = this.employeeAdapter.adaptArray(res.iterableData);
        this.totalPagesCount = res.count;
        this.isLoading = false;
      });
    }
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
  onPageChange(pageStateUpdates: Partial<GetEmployeesQueryParams>) {
    if (pageStateUpdates.take) {
      this.pageState.index = 0;
    }
    this.pageState = {
      ...this.pageState,
      ...pageStateUpdates,
    };
    setLocalStorageItem(
      LocalStorageKeys.GetEmployees,

      JSON.stringify(this.pageState),
    );
    this.getEmployees();
    // this..getTodos(this.pageState).subscribe((res) => {
    //   this.employees = res.iterableData;
    //   this.totalPagesCount = res.totalPageCount;
    // });
  }

  onAssignTask(id: number) {
    this.router.navigateByUrl(`${END_POINTS.portal}/assign-task/${id}`, {
      replaceUrl: true,
    });
    // this.router.navigate([`../assign-task/${id}`], {
    //   relativeTo: this.route,
    //   replaceUrl: true,
    // });
  }
}
