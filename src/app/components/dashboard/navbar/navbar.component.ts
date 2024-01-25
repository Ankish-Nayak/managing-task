import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  RouterLink,
  Router,
  NavigationEnd,
} from '@angular/router';
import { END_POINTS } from '../../../utils/constants';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { AuthService } from '../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  navLinks: {
    name: string;
    path: string;
    active: boolean;
  }[] = [
    {
      name: 'TodoList',
      path: this.processPath(END_POINTS.todoList),
      active: false,
    },
    {
      name: 'DepartmentList',
      path: this.processPath(END_POINTS.departmentList),
      active: true,
    },
    {
      name: 'CreateTodo',
      path: this.processPath(END_POINTS.createTodo),
      active: false,
    },
  ];
  profileLinks: {
    name: string;
  }[] = [
    { name: 'profile' },
    { name: 'updateProfile' },
    {
      name: 'logout',
    },
  ];
  ngOnInit(): void {
    // Subscribe to route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Call a function to get the active router endpoint
        const endpoint = this.getActiveEndpoint();
        console.log(endpoint);
        this.updateNavLinks(endpoint);
      });
  }
  updateNavLinks(endpoint: string) {
    this.navLinks = this.navLinks.map((n) => {
      const newN = {
        ...n,
      };
      if (newN.path === endpoint) {
        newN.active = true;
      } else {
        newN.active = false;
      }
      return newN;
    });
    console.log(this.navLinks);
  }
  getCurrentPath() {
    return this.router.url;
  }

  processPath(path: string) {
    return `./${path}`;
  }
  processClass(id: number) {
    let style = 'nav-link';
    const navLink = this.navLinks.at(id);
    if (!navLink) {
      return style;
    }
    if (navLink.active) {
      style = style + ' active';
    }
    return style;
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  getActiveEndpoint() {
    // Get the current activated route
    let currentRoute = this.route;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    // Get the URL segments of the activated route
    const urlSegments = currentRoute.snapshot.url.map(
      (segment) => segment.path,
    );

    // Determine the active endpoint based on the URL segments
    const activeEndpoint = '/' + urlSegments.join('/');
    return `.${activeEndpoint}`;
  }
  handleProfileLinks(event: MouseEvent, name: string) {
    event.preventDefault();
    console.log(name);
    switch (name) {
      case 'profile': {
        //TODO: make profile open
        break;
      }
      case 'updateProfile': {
        //TODO: update profile open
        break;
      }
      case 'logout': {
        this.router.navigate([``]);
        this.authService.logout().subscribe(() => {
          this.router.navigate([``]);
        });
        break;
      }
      default: {
        console.log(name);
      }
    }
  }
}
