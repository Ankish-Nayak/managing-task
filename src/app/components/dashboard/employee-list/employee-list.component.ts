import { Component, OnInit } from '@angular/core';
import {
  Employee,
  EmployeeAdapter,
} from '../../../shared/models/employee.model';
import { EmployeeService } from '../../../shared/services/employee/employee.service';
import { CommonModule } from '@angular/common';
import { ConfirmationModalComponent } from '../../../shared/modals/confirmation-modal/confirmation-modal.component';
import { EmployeeComponent } from './employee/employee.component';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { ICONS } from '../../../shared/icons/icons';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    ConfirmationModalComponent,
    EmployeeComponent,
    HighlightDirective,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent implements OnInit {
  employees!: Employee[];
  isLoading: boolean = true;
  employeeToBeDeletedID: number | null = null;
  readonly ICONS = ICONS;
  constructor(
    private employeeService: EmployeeService,
    private employeeAdapter: EmployeeAdapter,
    private authService: AuthService,
  ) {}
  ngOnInit(): void {
    this.getEmployees();
  }
  getEmployees() {
    this.isLoading = true;
    this.employeeService.getEmployees({}).subscribe((res) => {
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
  print() {
    console.log('enter');
  }
  delete(id: number) {
    this.employeeToBeDeletedID = id;
  }
}
