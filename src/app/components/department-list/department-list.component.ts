import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../shared/services/department/department.service';
import { CommonModule } from '@angular/common';
import { IDepartment } from '../../shared/interfaces/requests/department.interface';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss',
})
export class DepartmentListComponent implements OnInit {
  departments!: IDepartment[];
  constructor(private departmentService: DepartmentService) {}
  ngOnInit(): void {
    this.getDepartments();
  }

  getDepartments() {
    this.departmentService.getDepartments().subscribe((res) => {
      this.departments = res;
      console.log(res);
    });
  }
}
