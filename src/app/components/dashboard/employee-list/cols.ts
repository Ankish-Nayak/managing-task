import { TEmployee } from '../../../shared/interfaces/employee.type';

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
  idName: string;
  render: boolean;
  class?: 'pointer';
}[];
export const COLS: TCOLS = [
  {
    name: 'sNo',
    notAllowedUsers: null,
    idName: 'sNo',
    render: true,
  },
  {
    name: 'Name',
    notAllowedUsers: null,
    idName: 'name',
    render: true,
    class: 'pointer',
  },
  {
    name: 'Department',
    notAllowedUsers: null,
    idName: 'description',

    render: true,
    class: 'pointer',
  },
  {
    name: 'Email',
    notAllowedUsers: null,
    idName: 'email',

    render: true,

    class: 'pointer',
  },
  {
    name: 'Phone',
    notAllowedUsers: ['employee'],
    idName: 'phone',
    render: true,

    class: 'pointer',
  },
  {
    name: 'Address',
    notAllowedUsers: ['admin'],
    idName: 'Address',
    render: true,
    class: 'pointer',
  },

  {
    name: 'City',
    notAllowedUsers: null,
    idName: 'city',
    render: true,
    class: 'pointer',
  },
  {
    name: 'Country',
    notAllowedUsers: null,
    idName: 'country',
    render: true,
    class: 'pointer',
  },
  {
    name: 'Actions',
    notAllowedUsers: null,
    idName: 'actions',
    render: true,
  },
];
