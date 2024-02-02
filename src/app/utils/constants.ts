import { TEmployee } from '../shared/interfaces/employee.type';
export const USER_ROLES_KEY = 'userRole';
export const AUTH_TOKEN = 'authToken';
export const USER_KEY = 'user';
export const GET_TODOS_KEY = 'getTodosKey';
//TODO: to be changed.
export const END_POINTS = {
  dashboard: 'dashboard',
  login: '',
  sigup: 'signup',
  departmentList: '',
  todoList: 'todos',
  createTodo: 'create-todo',
  createAdmin: 'create-admin',
  adminList: 'admins',
  updateTodo: 'update-todo/:id',
  updateAdmin: 'update-admin/:id',
  todoDetail: 'todo-detail/:id',
  employeeList: 'employees',
  notAllowedUser: 'not-allowed-user',
  profile: 'profile',
  test: 'test',
};

// 0 -> means employee
// 1 -> means admin
// 2 -> super admin
export const EMPLOYEE_TYPE = {
  employee: 0,
  admin: 1,
  superAdmin: 2,
};

export enum USER_ROLES {
  Employee = 'employee',
  Admin = 'admin',
  SuperAdmin = 'superadmin',
}

export enum COMPONENT_NAME {
  UPSERT_ADMIN_COMPONENT = 'upsert-admin-component',
  UPSERT_TODO_COMPONENT = 'upsert-todo-component',
  UPSERT_EMPLOYEE_COMPONENT = 'upsert_employee_component',
  TODO_DETAIL_COMPONENT = 'todo-detail-component',
}

// export const USER_ROLES: {[key: string]: TEmployee} = {
//   employee: 'employee',
//   admin: 'admin',
//   superAdmin: 'superadmin',
// };
