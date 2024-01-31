import { TEmployee } from '../../../shared/interfaces/employee.type';

export type TcolsName =
  | 'sNo'
  | 'Title'
  | 'Description'
  | 'IsCompleted'
  | 'AssignedTo'
  | 'AssignedBy'
  | 'Actions';
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
    name: 'Title',
    notAllowedUsers: null,
    idName: 'title',
    render: true,
    class: 'pointer',
  },
  {
    name: 'Description',
    notAllowedUsers: null,
    idName: 'description',

    render: true,
    class: 'pointer',
  },
  {
    name: 'IsCompleted',
    notAllowedUsers: null,
    idName: 'isCompleted',

    render: true,

    class: 'pointer',
  },
  {
    name: 'AssignedTo',
    notAllowedUsers: ['employee'],
    idName: 'assignedTo',
    render: true,

    class: 'pointer',
  },
  {
    name: 'AssignedBy',
    notAllowedUsers: ['admin'],
    idName: 'assignedBy',

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
