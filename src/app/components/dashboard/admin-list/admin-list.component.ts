import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../shared/services/employee/employee.service';
import { Employee } from '../../../shared/models/employee.model';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-list',
  standalone: true,
  imports: [CommonModule, AdminComponent, ReactiveFormsModule],
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.scss',
})
export class AdminListComponent implements OnInit {
  admins!: Employee[];
  adminForm!: FormGroup;
  constructor(private employeeService: EmployeeService) {}
  ngOnInit(): void {
    this.employeeService.getAdmins(1).subscribe((res) => {
      this.admins = res.iterableData.map((item) => {
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
    });
  }
  adminFormInit() {
    this.adminForm = new FormGroup({});
  }
}
