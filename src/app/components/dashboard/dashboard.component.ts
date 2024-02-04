import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeService } from '../../shared/services/employee/employee.service';
import { TodoService } from '../../shared/services/todo/todo.service';
import { END_POINTS } from '../../utils/constants';
import { DashboardDetailCardComponent } from './dashboard-detail-card/dashboard-detail-card.component';
import { NavbarComponent } from './navbar/navbar.component';
//TODO: make user based rendering of dashboard component

interface ICard {
  title: string;
  count: number;
  description: string;
  cardLinks: { label: string; endPoint: string }[];
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    DashboardDetailCardComponent,
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  cards: ICard[] = [];
  constructor(
    private employeeService: EmployeeService,
    private todoService: TodoService,
  ) {}
  ngOnInit(): void {
    this.cardsDataInit();
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
      });
    });
  }
  getTodosDetails() {
    this.employeeService.getAdmins({}).subscribe((res) => {
      this.cards.push({
        title: 'Admins',
        description: 'Admins of each department.',
        count: res.iterableData.length,
        cardLinks: [
          {
            label: 'View todos',
            endPoint: `${END_POINTS.portal}/${END_POINTS.todoList}`,
          },
        ],
      });
    });
  }
  getAdminsDetails() {
    this.todoService.getTodos({}).subscribe((res) => {
      this.cards.push({
        title: 'Todos',
        description: 'Assign and view assigned tasks.',
        count: res.totalPageCount,
        cardLinks: [
          {
            label: 'View admins',
            endPoint: `${END_POINTS.portal}/${END_POINTS.adminList}`,
          },
        ],
      });
    });
  }
}
