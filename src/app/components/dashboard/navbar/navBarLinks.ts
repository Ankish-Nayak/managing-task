import { TEmployee } from '../../../shared/interfaces/employee.type';
import { END_POINTS, UserRole } from '../../../utils/constants';
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
    notAllowedUsers: [UserRole.Employee, UserRole.Admin],
  },
  // {
  //   name: 'AdminList',
  //   path: processPath(END_POINTS.adminList),
  //   active: false,
  //   notAllowedUsers: [UserRole.Employee, UserRole.Admin],
  // },
  {
    name: 'EmployeeList',
    path: processPath(END_POINTS.employeeList),
    active: false,
    notAllowedUsers: [UserRole.Employee],
  },
];

export type TProfileLinks = {
  name: string;
}[];

export const PROFILE_LINKS: TProfileLinks = [
  { name: 'profile' },

  {
    name: 'notifications',
  },
  { name: 'chats' },
  {
    name: 'logout',
  },
];
