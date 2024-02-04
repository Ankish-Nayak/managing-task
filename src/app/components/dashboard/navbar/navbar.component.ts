import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { TEmployee } from '../../../shared/interfaces/employee.type';
import { UserViewNavLinksPipe } from '../../../shared/pipes/user-view-nav-links/user-view-nav-links.pipe';
import { ActiveEndpointService } from '../../../shared/services/activeEndpoint/active-endpoint.service';
import { AuthService } from '../../../shared/services/auth/auth.service';
import {
  NAV_LINKS,
  PROFILE_LINKS,
  TNavLinks,
  TProfileLinks,
} from './navBarLinks';
import { END_POINTS } from '../../../utils/constants';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    RouterLinkActive,
    UserViewNavLinksPipe,
    NgbTooltipModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  navLinks: TNavLinks = NAV_LINKS;
  profileLinks: TProfileLinks = PROFILE_LINKS;
  userType!: TEmployee;
  readonly END_POINTS = END_POINTS;
  ngOnInit(): void {
    this.getEmployeeType();
    this.route.data.subscribe(() => {
      console.log(this.getActiveEndpoint());
    });
    this.activeEndpoint.activeEndpointMessage$.subscribe((endPoint) => {
      this.updateNavLinks(endPoint);
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
    private activeEndpoint: ActiveEndpointService,
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
    console.log(urlSegments);

    // Determine the active endpoint based on the URL segments
    const activeEndpoint = '/' + urlSegments.join('/');
    return `.${activeEndpoint}`;
  }
  getEmployeeType() {
    this.authService.userTypeMessage$.subscribe((res) => {
      console.log('userType', res);
      if (res !== null) this.userType = res;
    });
  }
  handleProfileLinks(event: MouseEvent, name: string) {
    event.preventDefault();
    console.log(name);
    switch (name) {
      case 'profile': {
        //TODO: make profile open
        // this.router.navigateByUrl(
        //   `${END_POINTS.dashboard}/${END_POINTS.profile}`,
        // );
        this.router.navigateByUrl(
          `${END_POINTS.dashboard}/${END_POINTS.upsertProfile}`,
        );
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
