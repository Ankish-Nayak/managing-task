import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationModalComponent } from '../../../shared/components/modals/confirmation-modal/confirmation-modal.component';
import { PaginationComponent } from '../../../shared/components/paginations/pagination/pagination.component';
import { HighlightDirective } from '../../../shared/directives/highlight/highlight.directive';
import { ICONS } from '../../../shared/icons/icons';
import { GetEmployeesQueryParams } from '../../../shared/interfaces/requests/employee.interface';
import {
  Employee,
  EmployeeAdapter,
} from '../../../shared/models/employee.model';
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
import { DataTableControlPanelComponent } from '../../../shared/components/controlPanels/data-table-control-panel/data-table-control-panel.component';
import { UpsertContentModalComponent } from '../../../shared/components/modals/upsert-content-modal/upsert-content-modal.component';
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
  public employees!: Employee[];
  public isLoading: boolean = true;
  private employeeToBeDeletedID: number | null = null;
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
  public totalPagesCount: number = 0;
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
  public getEmployeeTabs() {
    if (this.userType === UserRole.Employee) {
      return [];
    } else if (this.userType === UserRole.Admin) {
      return [EmployeeTab.All];
    } else {
      return [EmployeeTab.Admins, EmployeeTab.All, EmployeeTab.Employees];
    }
  }
  public getQueryParams() {
    this.route.queryParams.subscribe((params) => {
      console.log('params ', params);
      const employeeTab = params['employeeTab'];
      const key = Object.values(EmployeeTab).find((e) => e === employeeTab);
      if (key) {
        this.employeeTab = key;
      }
    });
  }
  public getEmployeesByDepartment() {
    this.isLoading = true;
  }
  private getEmployees() {
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
  public confirm(confirmation: boolean) {
    if (confirmation && this.employeeToBeDeletedID !== null) {
      this.employeeService
        .deleteEmployee(this.employeeToBeDeletedID)
        .subscribe(() => {
          this.getEmployees();
        });
    }
  }
  onViewEmployeesByDepartment() {}

  public delete(id: number) {
    this.employeeToBeDeletedID = id;
  }

  public onClicked(name: string) {
    this.employeeService
      .getEmployees({
        orderBy: name,
        orders: 1,
      })
      .subscribe((res) => {
        this.employees = res.iterableData;
      });
  }
  public onPageChange(pageStateUpdates: Partial<GetEmployeesQueryParams>) {
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

  public onAssignTask(id: number) {
    this.router.navigateByUrl(`${END_POINTS.portal}/assign-task/${id}`, {
      replaceUrl: true,
    });
  }
  public handleTabChange(tab: EmployeeTab) {
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
  public createAdmin() {
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
