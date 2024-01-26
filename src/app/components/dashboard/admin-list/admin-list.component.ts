import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../shared/services/employee/employee.service';
import { Employee } from '../../../shared/models/employee.model';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationModalComponent } from '../../../shared/modals/confirmation-modal/confirmation-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { END_POINTS } from '../../../utils/constants';

@Component({
  selector: 'app-admin-list',
  standalone: true,
  imports: [
    CommonModule,
    AdminComponent,
    ReactiveFormsModule,
    ConfirmationModalComponent,
  ],
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.scss',
})
export class AdminListComponent implements OnInit {
  isLoading: boolean = true;
  admins!: Employee[];
  adminForm!: FormGroup;
  adminToBeDeletedID: number | null = null;
  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  ngOnInit(): void {
    this.getAdmins();
  }
  getAdmins() {
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
      this.isLoading = false;
    });
  }
  delete(id: number) {
    this.adminToBeDeletedID = id;
  }
  update(id: number) {}
  createAdmin() {
    this.router.navigate([`../${END_POINTS.createAdmin}`], {
      relativeTo: this.route,
    });
  }
  adminFormInit() {
    this.adminForm = new FormGroup({});
  }
  confirm(confirmation: boolean) {
    if (confirmation && this.adminToBeDeletedID !== null) {
      console.log(`deleting ${this.adminToBeDeletedID}`);
      // this.employeeService
      //   .deleteEmployee(this.adminToBeDeletedID)
      //   .subscribe((res) => {
      //     console.log(res);
      //     this.getAdmins();
      //   });
    }
  }
}
