import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Params, RouterOutlet } from '@angular/router';
import { concatMap } from 'rxjs';
import { IDepartment } from '../../shared/interfaces/requests/department.interface';
import { IGetEmployees } from '../../shared/interfaces/requests/employee.interface';
import { ITask } from '../../shared/interfaces/requests/toto.interface';
import { UserViewDashboardDetailPipe } from '../../shared/pipes/user-view-dashboard-detail-card/user-view-dashboard-detail.pipe';
import { AuthService } from '../../shared/services/auth/auth.service';
import { DepartmentService } from '../../shared/services/department/department.service';
import { EmployeeService } from '../../shared/services/employee/employee.service';
import { TodoService } from '../../shared/services/todo/todo.service';
import { SpinnerComponent } from '../../sharedComponents/spinners/spinner/spinner.component';
import { END_POINTS, UserRole } from '../../utils/constants';
import { DashboardDetailCardComponent } from './dashboard-detail-card/dashboard-detail-card.component';
import { EmployeeTab } from './employee-list/employee-list.component';
import { NavbarComponent } from './navbar/navbar.component';
//TODO: make user based rendering of dashboard component

export interface ICard {
  title: string;
  count: number;
  description: string;
  cardLinks: { label: string; endPoint: string; queryParams?: Params | null }[];
  allowedUsers: UserRole[];
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    DashboardDetailCardComponent,
    CommonModule,
    SpinnerComponent,
    UserViewDashboardDetailPipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  isLoading: boolean = false;
  cards: ICard[] = [];
  userType!: UserRole;
  constructor(
    private employeeService: EmployeeService,
    private todoService: TodoService,
    private authService: AuthService,
    private departmentService: DepartmentService,
  ) {}
  ngOnInit(): void {
    this.getEmployeeType();
  }
  getEmployeeType() {
    this.authService.userTypeMessage$.subscribe((res) => {
      if (res !== null) {
        this.userType = res;
        if (this.userType === UserRole.Employee) {
          this.cardDataInOrderInitForEmployee();
        } else {
          this.cardDataInOrderInit();
        }
      }
    });
  }
  cardDataInOrderInitForEmployee() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.todoService.getTodos({}).subscribe((res) => {
      this.cards.push(this.getTodosDetails(res));
      this.isLoading = false;
    });
  }
  cardDataInOrderInit() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.employeeService
      .getAdmins({})
      .pipe(
        concatMap((firstApiRes) => {
          this.cards.push(this.getAdminsDetails(firstApiRes));
          return this.employeeService.getEmployees({});
        }),
        concatMap((secondApiRes) => {
          this.cards.push(this.getEmployeeesDetails(secondApiRes));
          return this.todoService.getTodos({});
        }),
        concatMap((thirdApiRes) => {
          this.cards.push(this.getTodosDetails(thirdApiRes));
          return this.departmentService.getDepartments();
        }),
      )
      .subscribe(
        (fourthApiRes) => {
          this.cards.push(this.getDepartmentDetails(fourthApiRes));
        },
        () => {},
        () => {
          this.isLoading = false;
        },
      );
  }
  getEmployeeesDetails(res: IGetEmployees) {
    return {
      title: 'Employees',
      description: 'Place to create and delete employees.',
      count: res.iterableData.length,
      cardLinks: this.processLinks([
        {
          label: 'View employees',
          endPoint: `${END_POINTS.portal}/${END_POINTS.employeeList}`,
          queryParams: {
            employeeTab:
              this.userType === UserRole.Admin
                ? EmployeeTab.All
                : EmployeeTab.Employees,
          },
          notAllowedUsers: [UserRole.Employee],
        },
      ]),
      allowedUsers: [UserRole.Admin, UserRole.SuperAdmin],
    };
  }
  getTodosDetails(res: { iterableData: ITask[]; totalPageCount: number }) {
    return {
      title: 'Todos',
      description: (() => {
        if (this.userType === 'superadmin') {
          return 'Todos of each department.';
        } else if (this.userType === 'employee') {
          return 'See your Assigned Todos.';
        } else {
          return 'See Todos assigned Todos.';
        }
      })(),
      count: res.iterableData.length,
      cardLinks: this.processLinks([
        {
          label: 'View todos',
          endPoint: `${END_POINTS.portal}/${END_POINTS.todoList}`,
          notAllowedUsers: [],
        },
        {
          label: 'Create todos',
          endPoint: `${END_POINTS.portal}/${END_POINTS.createTodo}`,
          notAllowedUsers: [UserRole.Employee],
        },
      ]),
      allowedUsers: [UserRole.Admin, UserRole.SuperAdmin, UserRole.Employee],
    };
  }
  getAdminsDetails(res: IGetEmployees) {
    return {
      title: 'Admins',
      description: 'Assign and view assigned tasks.',
      count: res.count,
      cardLinks: this.processLinks([
        {
          label: 'View admins',
          endPoint: `${END_POINTS.portal}/${END_POINTS.employeeList}`,
          queryParams: {
            employeeTab: EmployeeTab.Admins,
          },
          notAllowedUsers: [],
        },
        {
          label: 'Create Admins',
          endPoint: `${END_POINTS.portal}/${END_POINTS.createAdmin}`,
          notAllowedUsers: [UserRole.Admin, UserRole.Employee],
        },
      ]),
      allowedUsers: [UserRole.SuperAdmin],
    };
  }
  getDepartmentDetails(res: IDepartment[]) {
    return {
      title: 'Departments',
      description: 'View Department and their admins',
      count: res.length,
      cardLinks: [
        {
          label: 'View Departments',
          endPoint: `${END_POINTS.portal}/${END_POINTS.departmentList}`,
        },
      ],
      allowedUsers: [UserRole.SuperAdmin],
    };
  }
  processLinks(
    links: {
      label: string;
      endPoint: string;
      queryParams?: Params | null;
      notAllowedUsers: UserRole[];
    }[],
  ) {
    const newLinks: {
      label: string;
      endPoint: string;
    }[] = links
      .filter((link) => !link.notAllowedUsers.includes(this.userType))
      .map((link) => ({
        label: link.label,
        endPoint: link.endPoint,
        queryParams: link.queryParams,
      }));
    return newLinks;
  }
}
