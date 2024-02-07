import { TEmployee } from '../../../shared/interfaces/employee.type';
import { Employee } from '../../../shared/models/employee.model';

export type TcolsName =
  | 'sNo'
  | 'Name'
  | 'Department'
  | 'Email'
  | 'Phone'
  | 'AssignedBy'
  | 'City'
  | 'Country'
  | 'Actions'
  | 'Address';
export type TCOLS = {
  name: TcolsName;
  notAllowedUsers: TEmployee[] | null;
  idName: keyof Employee | null;
  render: boolean;
  canSort?: 'pointer';
}[];
export const COLS: TCOLS = [
  {
    name: 'sNo',
    notAllowedUsers: null,
    idName: null,
    render: true,
  },
  {
    name: 'Name',
    notAllowedUsers: null,
    idName: 'name',
    render: true,
    canSort: 'pointer',
  },
  {
    name: 'Department',
    notAllowedUsers: null,
    idName: 'departmentName',

    render: true,
  },
  {
    name: 'Email',
    notAllowedUsers: null,
    idName: 'email',
    render: true,
    canSort: 'pointer',
  },
  {
    name: 'Phone',
    notAllowedUsers: ['employee'],
    idName: 'phone',
    render: true,
  },
  {
    name: 'Address',
    notAllowedUsers: ['admin'],
    idName: 'address',
    render: true,
  },

  {
    name: 'City',
    notAllowedUsers: null,
    idName: 'city',
    render: true,
    canSort: 'pointer',
  },
  {
    name: 'Country',
    notAllowedUsers: null,
    idName: 'country',
    render: true,
    canSort: 'pointer',
  },
  {
    name: 'Actions',
    notAllowedUsers: null,
    idName: null,
    render: true,
  },
];
