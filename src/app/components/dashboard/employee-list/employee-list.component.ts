import { Component, OnInit } from '@angular/core';
import { Employee } from '../../../shared/models/employee.model';
import { EmployeeService } from '../../../shared/services/employee/employee.service';
import { CommonModule } from '@angular/common';
import { ConfirmationModalComponent } from '../../../shared/modals/confirmation-modal/confirmation-modal.component';
import { EmployeeComponent } from './employee/employee.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, ConfirmationModalComponent, EmployeeComponent],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent implements OnInit {
  employees!: Employee[];
  isLoading: boolean = true;
  employeeToBeDeletedID: number | null = null;
  constructor(private employeeService: EmployeeService) {}
  ngOnInit(): void {
    this.getEmployees();
  }
  getEmployees() {
    this.isLoading = true;
    this.employeeService.getEmployees(1).subscribe((res) => {
      this.employees = res.iterableData.map((item) => {
        return new Employee(
          item.id,
          item.name,
          item.email,
          item.employeeType,
          item.address,
          item.city,
          item.country,
          item.phone,
          item.departmentID,
          item.departmentName,
        );
      });
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
  delete(id: number) {
    this.employeeToBeDeletedID = id;
  }
}
