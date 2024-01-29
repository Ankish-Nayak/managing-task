import { Pipe, PipeTransform } from '@angular/core';
import { TNavLinks } from '../../../components/dashboard/navbar/navBarLinks';
import { TEmployee } from '../../interfaces/employee.type';

@Pipe({
  name: 'userViewNavLinks',
  standalone: true,
})
export class UserViewNavLinksPipe implements PipeTransform {
  transform(navLinks: TNavLinks, userType: TEmployee): TNavLinks {
    return navLinks.filter(
      (navLink) =>
        navLink.notAllowedUsers === null ||
        (navLink.notAllowedUsers !== null &&
          !navLink.notAllowedUsers.includes(userType)),
    );
  }
}
