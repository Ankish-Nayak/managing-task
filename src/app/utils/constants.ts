export const AUTH_TOKEN = 'authToken';
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
};

// 0 -> means employee
// 1 -> means admin
// 2 -> super admin
export const EMPLOYEE_TYPE = {
  employee: '0',
  admin: '1',
  superAdmin: '2',
};
