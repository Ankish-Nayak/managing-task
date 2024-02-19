import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ICONS } from '../../../shared/icons/icons';
import { TEmployee } from '../../../shared/interfaces/employee.type';
import { UserViewNavLinksPipe } from '../../../shared/pipes/user-view-nav-links/user-view-nav-links.pipe';
import { ActiveEndpointService } from '../../../shared/services/activeEndpoint/active-endpoint.service';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { NotificationService } from '../../../shared/services/notification/notification.service';
import { END_POINTS } from '../../../utils/constants';
import { getActiveEndpoint } from '../../../utils/getActiveEndpoint';
import {
  NAV_LINKS,
  PROFILE_LINKS,
  TNavLinks,
  TProfileLinks,
} from './navBarLinks';
import { Subscription } from 'rxjs';

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
export class NavbarComponent implements OnInit, OnDestroy {
  public readonly END_POINTS = END_POINTS;
  public readonly ICONS = ICONS;
  public navLinks: TNavLinks = NAV_LINKS;
  public profileLinks: TProfileLinks = PROFILE_LINKS;
  public userType!: TEmployee;
  public activeEndPoint!: string;
  public notificationCount!: number;
  public notificationState!: boolean;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private activeEndpoint: ActiveEndpointService,
    private notificationService: NotificationService,
  ) {}
  ngOnInit(): void {
    const subscription1 =
      this.notificationService.openNotificationMessageSource$.subscribe(
        (res) => {
          this.notificationState = res;
        },
      );
    this.activeEndPoint = getActiveEndpoint(this.route);
    this.getEmployeeType();
    const subscription2 = this.route.data.subscribe(() => {
      console.log(getActiveEndpoint(this.route));
    });
    const subscription3 = this.activeEndpoint.activeEndpointMessage$.subscribe(
      (endPoint) => {
        this.updateNavLinks(endPoint);
      },
    );
    this.getNotificationCount();
    this.subscriptions.push(...[subscription1, subscription2, subscription3]);
  }
  private getNotificationCount() {
    const subscription = this.notificationService
      .getNotifications({ isSeen: false })
      .subscribe((res) => {
        this.notificationCount = res.length;
      });
    this.subscriptions.push(subscription);
  }
  private updateNavLinks(endpoint: string) {
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
  public processClass(id: number) {
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
  private getEmployeeType() {
    const subscription = this.authService.userTypeMessage$.subscribe((res) => {
      if (res !== null) this.userType = res;
    });
    this.subscriptions.push(subscription);
  }
  public handleProfileLinks(event: MouseEvent, name: string) {
    if (this.notificationState) {
      this.toggleNotification();
    }
    event.preventDefault();
    switch (name) {
      case 'profile': {
        this.router.navigateByUrl(
          `${END_POINTS.portal}/${END_POINTS.upsertProfile}`,
          { replaceUrl: true },
        );
        break;
      }
      case 'logout': {
        this.router.navigate([``]);
        const subscription = this.authService.logout().subscribe(() => {
          this.router.navigate([``]);
        });
        this.subscriptions.push(subscription);
        break;
      }
      default: {
        console.log(name);
      }
    }
  }
  public toggleNotification() {
    if (this.notificationState) {
      this.notificationService.closeNotification();
    } else {
      this.notificationService.openNotification();
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
