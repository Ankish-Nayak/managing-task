//TODO: to be changed.
export const END_POINTS = {
  dashboard: 'dashboard',
  login: '',
  sigup: 'signup',
  departmentList: 'departments',
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
  upsertProfile: 'upsert-profile',
  portal: 'portal',
  employeesByDepartment: 'employees-by-department/:id',
  assignTask: 'assign-task/:employeeId',
  notifications: 'notifications',
  chatBox: 'chat-box',
  chat: 'chat',
  message: 'message',
};

export enum Months {
  January = 1,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December,
}

export const EMPLOYEE_TYPE = {
  employee: 0,
  admin: 1,
  superAdmin: 2,
};

export enum UserRole {
  Employee = 'employee',
  Admin = 'admin',
  SuperAdmin = 'superadmin',
}

export enum LocalStorageKeys {
  UserRole = 'user_role',
  AuthToken = 'auth_token',
  User = 'user',
  GetTodos = 'get_todos',
  GetEmployees = 'get_employees',
}

export enum NotificationType {
  Assigned = 'Assigned',
  Completed = 'Completed',
  Updated = 'Updated',
}

export enum COMPONENT_NAME {
  UPSERT_ADMIN_COMPONENT = 'upsert-admin-component',
  UPSERT_TODO_COMPONENT = 'upsert-todo-component',
  UPSERT_EMPLOYEE_COMPONENT = 'upsert_employee_component',
  TODO_DETAIL_COMPONENT = 'todo-detail-component',
}
