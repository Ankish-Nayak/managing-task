import { Injectable } from '@angular/core';
import { TEmployee } from '../interfaces/employee.type';
import { Adapter } from './adapter';

export class NavLink {
  name: string;
  path: string;
  active: boolean;
  notAllowedUsers: TEmployee[] | null;
  constructor(
    name: string,
    path: string,
    active: boolean,
    notAllowedUsers: TEmployee[] | null,
  ) {
    this.name = name;
    this.path = path;
    this.active = active;
    this.notAllowedUsers = notAllowedUsers;
  }
}

@Injectable({
  providedIn: 'root',
})
export class NavLinkAdapter implements Adapter<NavLink> {
  adapt(item: any): NavLink {
    return new NavLink(item.name, item.path, item.active, item.notAllowedUsers);
  }
  adpatArray(items: any[]): NavLink[] {
    return items.map((item) => this.adapt(item));
  }
}
