import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../shared/services/employee/employee.service';
import {
  Employee,
  EmployeeAdapter,
} from '../../../shared/models/employee.model';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationModalComponent } from '../../../shared/modals/confirmation-modal/confirmation-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { END_POINTS, USER_ROLES } from '../../../utils/constants';
import { allowedToView } from '../../../utils/allowedToView';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { TEmployee } from '../../../shared/interfaces/employee.type';

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
  readonly allowedToview = allowedToView;
  readonly USER_ROLES = USER_ROLES;
  userType!: TEmployee;
  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private adminAdapter: EmployeeAdapter,
    private authService: AuthService,
  ) {}
  ngOnInit(): void {
    this.getAdmins();
    this.getUserType();
  }
  getUserType() {
    this.authService.userTypeMessage$.subscribe((res) => {
      if (res !== null) {
        this.userType = res;
      }
    });
  }
  getAdmins() {
    this.employeeService.getAdmins(1).subscribe((res) => {
      this.admins = this.adminAdapter.adaptArray(res.iterableData);
      this.isLoading = false;
    });
  }
  delete(id: number) {
    this.adminToBeDeletedID = id;
  }
  update(id: number) {
    this.router.navigate([`../update-admin/${id}`], { relativeTo: this.route });
  }
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
      this.employeeService
        .deleteEmployee(this.adminToBeDeletedID)
        .subscribe(() => {
          this.getAdmins();
        });
    }
  }
}
