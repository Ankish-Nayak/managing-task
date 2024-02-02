import { TEmployee } from '../../../shared/interfaces/employee.type';
import { Todo } from '../../../shared/models/todo.model';

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
  idName: keyof Todo | null;
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
    name: 'Title',
    notAllowedUsers: null,
    idName: 'title',
    render: true,
    canSort: 'pointer',
  },
  {
    name: 'Description',
    notAllowedUsers: null,
    idName: 'description',
    render: true,
    canSort: 'pointer',
  },
  {
    name: 'IsCompleted',
    notAllowedUsers: null,
    idName: 'isCompleted',
    render: true,
  },
  {
    name: 'AssignedTo',
    notAllowedUsers: ['employee'],
    idName: 'employeeName',
    render: true,
    // canSort: 'pointer',
  },
  {
    name: 'AssignedBy',
    notAllowedUsers: ['admin'],
    idName: 'assignBy',
    render: true,
    // canSort: 'pointer',
  },
  {
    name: 'Actions',
    notAllowedUsers: null,
    idName: null,
    render: true,
  },
];
