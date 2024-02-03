import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../dashboard/navbar/navbar.component';

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [RouterModule, NavbarComponent],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss',
})
export class PortalComponent {}
