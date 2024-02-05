import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TEmployee } from '../../shared/interfaces/employee.type';
import { AuthService } from '../../shared/services/auth/auth.service';
import { EmployeeService } from '../../shared/services/employee/employee.service';
import { TodoService } from '../../shared/services/todo/todo.service';
import { SpinnerComponent } from '../../shared/spinners/spinner/spinner.component';
import { END_POINTS, USER_ROLES } from '../../utils/constants';
import { DashboardDetailCardComponent } from './dashboard-detail-card/dashboard-detail-card.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserViewDashboardDetailPipe } from '../../shared/pipes/user-view-dashboard-detail-card/user-view-dashboard-detail.pipe';
//TODO: make user based rendering of dashboard component

export interface ICard {
  title: string;
  count: number;
  description: string;
  cardLinks: { label: string; endPoint: string }[];
  allowedUsers: USER_ROLES[];
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
  isLoading: boolean = true;
  cards: ICard[] = [];
  requestCount = 3;
  userType!: USER_ROLES;
  constructor(
    private employeeService: EmployeeService,
    private todoService: TodoService,
    private authService: AuthService,
  ) {}
  ngOnInit(): void {
    // this.cardsDataInit();
    this.getEmployeeType();
  }
  getEmployeeType() {
    this.authService.userTypeMessage$.subscribe((res) => {
      if (res !== null) {
        this.userType = res;
      }
      this.cardsDataInit();
    });
  }
  cardsDataInit() {
    this.getAdminsDetails();
    this.getEmployeeesDetails();
    this.getTodosDetails();
  }
  getEmployeeesDetails() {
    this.employeeService.getEmployees({}).subscribe((res) => {
      this.cards.push({
        title: 'Employees',
        description: 'Place to create and delete employees.',
        count: res.iterableData.length,
        cardLinks: [
          {
            label: 'View employees',
            endPoint: `${END_POINTS.portal}/${END_POINTS.employeeList}`,
          },
        ],
        allowedUsers: [USER_ROLES.Admin, USER_ROLES.SuperAdmin],
      });
      this.onRequestComplete();
    });
  }
  getTodosDetails() {
    this.employeeService.getAdmins({}).subscribe((res) => {
      this.cards.push({
        title: 'Todos',
        description: (() => {
          console.log(this.userType);
          if (this.userType === 'superadmin') {
            return 'Todos of each department.';
          } else if (this.userType === 'employee') {
            return 'See your Assigned Todos.';
          } else {
            return 'See Todos assigned Todos.';
          }
        })(),
        count: res.iterableData.length,
        cardLinks: [
          {
            label: 'View todos',
            endPoint: `${END_POINTS.portal}/${END_POINTS.todoList}`,
          },
          {
            label: 'Create todos',
            endPoint: `${END_POINTS.portal}/${END_POINTS.createTodo}`,
          },
        ],
        allowedUsers: [
          USER_ROLES.Admin,
          USER_ROLES.SuperAdmin,
          USER_ROLES.Employee,
        ],
      });

      this.onRequestComplete();
    });
  }
  getAdminsDetails() {
    this.todoService.getTodos({}).subscribe((res) => {
      this.cards.push({
        title: 'Admins',
        description: 'Assign and view assigned tasks.',
        count: res.totalPageCount,
        cardLinks: [
          {
            label: 'View admins',
            endPoint: `${END_POINTS.portal}/${END_POINTS.adminList}`,
          },
          {
            label: 'Create Admins',
            endPoint: `${END_POINTS.portal}/${END_POINTS.createAdmin}`,
          },
        ],
        allowedUsers: [USER_ROLES.SuperAdmin],
      });

      this.onRequestComplete();
    });
  }
  onRequestComplete() {
    this.requestCount--;
    if (this.requestCount === 0) {
      this.isLoading = false;
    }
  }
}
