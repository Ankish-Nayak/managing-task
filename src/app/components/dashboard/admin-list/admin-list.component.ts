import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfirmationModalComponent } from '../../../shared/components/modals/confirmation-modal/confirmation-modal.component';
import { UpsertContentModalComponent } from '../../../shared/components/modals/upsert-content-modal/upsert-content-modal.component';
import { TEmployee } from '../../../shared/interfaces/employee.type';
import {
  Employee,
  EmployeeAdapter,
} from '../../../shared/models/employee.model';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { EmployeeService } from '../../../shared/services/employee/employee.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { allowedToView } from '../../../utils/allowedToView';
import { COMPONENT_NAME, UserRole } from '../../../utils/constants';
import { AdminComponent } from './admin/admin.component';

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
export class AdminListComponent implements OnInit, OnDestroy {
  public readonly allowedToview = allowedToView;
  public readonly UserRole = UserRole;
  public isLoading: boolean = true;
  public admins!: Employee[];
  public userType!: TEmployee;
  private adminToBeDeletedID: number | null = null;
  private subcriptions: Subscription[] = [];
  constructor(
    private employeeService: EmployeeService,
    private adminAdapter: EmployeeAdapter,
    private authService: AuthService,
    private toastService: ToastService,
    private modalService: NgbModal,
  ) {}
  ngOnInit(): void {
    this.getAdmins();
    this.getUserType();
  }
  private getUserType() {
    const subscription = this.authService.userTypeMessage$.subscribe((res) => {
      if (res !== null) {
        this.userType = res;
      }
    });
    this.subcriptions.push(subscription);
  }
  private getAdmins() {
    const subscription = this.employeeService.getAdmins({}).subscribe({
      next: (res) => {
        this.admins = this.adminAdapter.adaptArray(res.iterableData);
      },
      error: (e) => {
        this.toastService.show(
          'Fetching Todos',
          'Failed to fetching todos',
          'error',
          2000,
        );
        console.log(e);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
    this.subcriptions.push(subscription);
  }
  public delete(id: number) {
    this.adminToBeDeletedID = id;
  }
  public update(id: number) {
    const ref = this.modalService.open(UpsertContentModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });
    ref.componentInstance.update = true;
    ref.componentInstance.id = id;
    ref.componentInstance.componentName = COMPONENT_NAME.UPSERT_ADMIN_COMPONENT;
    const subscription1 = ref.closed.subscribe((res) => {
      console.log(res);
      this.getAdmins();
    });
    const subscription2 = ref.dismissed.subscribe((res) => {
      console.log(res);
      this.toastService.show(
        'Admin Updation',
        'Admin updation was cancelled',
        'info',
      );
    });
    this.subcriptions.push(...[subscription1, subscription2]);
  }
  public createAdmin() {
    const ref = this.modalService.open(UpsertContentModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });
    ref.componentInstance.update = false;
    ref.componentInstance.componentName = COMPONENT_NAME.UPSERT_ADMIN_COMPONENT;
    const subscription1 = ref.closed.subscribe((res) => {
      console.log(res);
      this.getAdmins();
    });

    const subscription2 = ref.dismissed.subscribe((res) => {
      console.log(res);
      this.toastService.show(
        'Create Admin',
        'Admin creation was cancelled',
        'info',
      );
    });
    this.subcriptions.push(...[subscription1, subscription2]);
  }
  public confirm(confirmation: boolean) {
    if (confirmation && this.adminToBeDeletedID !== null) {
      const subscription = this.employeeService
        .deleteEmployee(this.adminToBeDeletedID)
        .subscribe(() => {
          this.getAdmins();
        });
      this.subcriptions.push(subscription);
    }
  }
  ngOnDestroy(): void {
    this.subcriptions.forEach((s) => s.unsubscribe());
  }
}
