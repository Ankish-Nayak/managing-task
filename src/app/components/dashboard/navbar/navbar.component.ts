import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TEmployee } from '../../../shared/interfaces/employee.type';
import { UserViewNavLinksPipe } from '../../../shared/pipes/user-view-nav-links/user-view-nav-links.pipe';
import { ActiveEndpointService } from '../../../shared/services/activeEndpoint/active-endpoint.service';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { END_POINTS } from '../../../utils/constants';
import { getActiveEndpoint } from '../../../utils/getActiveEndpoint';
import {
  NAV_LINKS,
  PROFILE_LINKS,
  TNavLinks,
  TProfileLinks,
} from './navBarLinks';
import { NotificationService } from '../../../shared/services/notification/notification.service';

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
  activeEndPoint!: string;
  notificationCount!: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private activeEndpoint: ActiveEndpointService,
    private notificationService: NotificationService,
  ) {}
  ngOnInit(): void {
    this.activeEndPoint = getActiveEndpoint(this.route);
    this.getEmployeeType();
    this.route.data.subscribe(() => {
      console.log(getActiveEndpoint(this.route));
    });
    this.activeEndpoint.activeEndpointMessage$.subscribe((endPoint) => {
      this.updateNavLinks(endPoint);
    });
    this.getNotificationCount();
  }
  getNotificationCount() {
    this.notificationService
      .getNotifications({ isSeen: false })
      .subscribe((res) => {
        this.notificationCount = res.length;
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
  getEmployeeType() {
    this.authService.userTypeMessage$.subscribe((res) => {
      if (res !== null) this.userType = res;
    });
  }
  handleProfileLinks(event: MouseEvent, name: string) {
    event.preventDefault();
    switch (name) {
      case 'profile': {
        this.router.navigateByUrl(
          `${END_POINTS.portal}/${END_POINTS.upsertProfile}`,
          { replaceUrl: true },
        );
        break;
      }
      case 'notifications': {
        this.router.navigateByUrl(
          `${END_POINTS.portal}/${END_POINTS.notifications}`,
          {
            replaceUrl: true,
          },
        );
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
