import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HighlightDirective } from '../../../shared/directives/highlight/highlight.directive';
import { ICONS } from '../../../shared/icons/icons';
import { GetEmployeesQueryParams } from '../../../shared/interfaces/requests/employee.interface';
import { ConfirmationModalComponent } from '../../../shared/modals/confirmation-modal/confirmation-modal.component';
import {
  Employee,
  EmployeeAdapter,
} from '../../../shared/models/employee.model';
import { PaginationComponent } from '../../../shared/paginations/pagination/pagination.component';
import { EmployeeService } from '../../../shared/services/employee/employee.service';
import {
  COMPONENT_NAME,
  END_POINTS,
  LocalStorageKeys,
  UserRole,
} from '../../../utils/constants';
import { EmployeeListHeaderComponent } from './employee-list-header/employee-list-header.component';
import { EmployeeComponent } from './employee/employee.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableControlPanelComponent } from '../../../shared/controlPanels/data-table-control-panel/data-table-control-panel.component';
import { UpsertContentModalComponent } from '../../../shared/modals/upsert-content-modal/upsert-content-modal.component';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '../../../utils/localStorageCRUD';
import { COLS } from './cols';
//TODO: add placeholder on every small element which exists like employee todo and alll to make this
//much better
export enum EmployeeTab {
  All = 'All',
  Admins = 'Admins',
  Employees = 'Employees',
}

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
    DataTableControlPanelComponent,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent implements OnInit, OnDestroy {
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
  controlsClass: string = 'container-fluid';
  totalPagesCount: number = 0;
  departmentId: string | null = null;
  userType!: UserRole;
  readonly cols = COLS;
  employeesTabs: EmployeeTab[] = [
    EmployeeTab.All,
    EmployeeTab.Admins,
    EmployeeTab.Employees,
  ];
  employeeTab: EmployeeTab = EmployeeTab.All;
  readonly ICONS = ICONS;
  readonly UserRole = UserRole;
  readonly EmployeeTab = EmployeeTab;
  constructor(
    private employeeService: EmployeeService,
    private employeeAdapter: EmployeeAdapter,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private modalService: NgbModal,
    private toastService: ToastService,
  ) {}
  ngOnInit(): void {
    this.getQueryParams();
    this.authService.userTypeMessage$.subscribe((res) => {
      if (res) {
        this.userType = res;
        this.employeesTabs = this.getEmployeeTabs();
      }
    });
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.departmentId = id;
      this.getEmployees();
    });
    this.controlsClass =
      'container-fluid ' +
      (this.employeeTab === this.EmployeeTab.All && this.departmentId === null
        ? ''
        : 'invisible');
  }
  getEmployeeTabs() {
    if (this.userType === UserRole.Employee) {
      return [];
    } else if (this.userType === UserRole.Admin) {
      return [EmployeeTab.All];
    } else {
      return [EmployeeTab.Admins, EmployeeTab.All, EmployeeTab.Employees];
    }
  }
  getQueryParams() {
    this.route.queryParams.subscribe((params) => {
      console.log('params ', params);
      const employeeTab = params['employeeTab'];
      const key = Object.values(EmployeeTab).find((e) => e === employeeTab);
      if (key) {
        this.employeeTab = key;
      }
    });
  }
  getEmployeesByDepartment(id: number) {
    this.isLoading = true;
  }
  getEmployees() {
    // this.isLoading = true;
    if (this.departmentId) {
      this.employeeService
        .getEmployeesByDepartment(Number(this.departmentId), {})
        .subscribe((res) => {
          this.employees = this.employeeAdapter.adaptArray(res.iterableData);
          this.totalPagesCount = res.count;
          this.isLoading = false;
        });
    } else {
      this.handleTabChange(this.employeeTab);
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
    console.log('changes happening', this.pageState);
    this.getEmployees();
  }

  onAssignTask(id: number) {
    this.router.navigateByUrl(`${END_POINTS.portal}/assign-task/${id}`, {
      replaceUrl: true,
    });
  }
  handleTabChange(tab: EmployeeTab) {
    this.controlsClass =
      'container-fluid ' +
      (tab === this.EmployeeTab.All && this.departmentId === null
        ? ''
        : 'invisible');
    this.employeeTab = tab;
    console.log('tab', this.employeeTab);
    if (this.employeeTab === EmployeeTab.All) {
      this.employeeService
        .getEmployeesAndAdmins(this.pageState)
        .subscribe((res) => {
          this.employees = this.employeeAdapter.adaptArray(res.iterableData);
          this.totalPagesCount = res.count;
          this.isLoading = false;
        });
    } else if (this.employeeTab === EmployeeTab.Admins) {
      this.employeeService.getAdmins({}).subscribe((res) => {
        this.employees = this.employeeAdapter.adaptArray(res.iterableData);
        this.totalPagesCount = res.count;
        this.isLoading = false;
      });
    } else {
      this.employeeService.getEmployees({}).subscribe((res) => {
        this.employees = this.employeeAdapter.adaptArray(res.iterableData);
        this.totalPagesCount = res.count;
        this.isLoading = false;
      });
    }
  }
  createAdmin() {
    const ref = this.modalService.open(UpsertContentModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });
    ref.componentInstance.update = false;
    ref.componentInstance.componentName = COMPONENT_NAME.UPSERT_ADMIN_COMPONENT;
    ref.closed.subscribe((res) => {
      console.log(res);
      this.handleTabChange(this.employeeTab);
    });

    ref.dismissed.subscribe((res) => {
      console.log(res);
      this.toastService.show(
        'Create Admin',
        'Admin creation was cancelled',
        'info',
      );
    });
  }
  ngOnDestroy(): void {
    removeLocalStorageItem(LocalStorageKeys.GetEmployees);
  }
}
