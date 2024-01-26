import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
//TODO: make user based rendering of dashboard component
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
