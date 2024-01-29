import { TEmployee } from '../shared/interfaces/employee.type';

export const allowedToView = (
  allowedUsers: TEmployee[],
  userType: TEmployee,
) => {
  return allowedUsers.includes(userType);
};
