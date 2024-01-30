import { TEmployee } from '../../../shared/interfaces/employee.type';
import { END_POINTS, USER_ROLES } from '../../../utils/constants';
export type TNavLinks = {
  name: string;
  path: string;
  active: boolean;
  notAllowedUsers: TEmployee[] | null;
}[];
const processPath = (path: string) => {
  return `./${path}`;
};
export const NAV_LINKS: TNavLinks = [
  {
    name: 'TodoList',
    path: processPath(END_POINTS.todoList),
    active: false,
    notAllowedUsers: null,
  },
  {
    name: 'DepartmentList',
    path: processPath(END_POINTS.departmentList),
    active: false,
    notAllowedUsers: null,
  },
  {
    name: 'AdminList',
    path: processPath(END_POINTS.adminList),
    active: false,
    notAllowedUsers: [USER_ROLES.Employee],
  },
  {
    name: 'EmployeeList',
    path: processPath(END_POINTS.employeeList),
    active: false,
    notAllowedUsers: [USER_ROLES.Employee],
  },
];

export type TProfileLinks = {
  name: string;
}[];

export const PROFILE_LINKS: TProfileLinks = [
  { name: 'profile' },
  { name: 'updateProfile' },
  {
    name: 'logout',
  },
];