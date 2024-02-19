import { Injectable } from '@angular/core';
import { TEmployee } from '../interfaces/employee.type';
import { Adapter } from './adapter';

export class NavLink {
  public name: string;
  public path: string;
  public active: boolean;
  public notAllowedUsers: TEmployee[] | null;
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
  public adapt(item: any): NavLink {
    return new NavLink(item.name, item.path, item.active, item.notAllowedUsers);
  }
  public adpatArray(items: any[]): NavLink[] {
    return items.map((item) => this.adapt(item));
  }
}
