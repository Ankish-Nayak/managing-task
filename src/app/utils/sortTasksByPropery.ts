import { ITask } from '../shared/interfaces/requests/toto.interface';

export const sortTasksByProperty = (
  tasks: ITask[],
  property: keyof ITask,
  dsc: boolean,
): ITask[] => {
  return tasks.sort((a, b) => {
    if (a[property] < b[property]) {
      return dsc ? 1 : -1;
    }
    if (a[property] > b[property]) {
      return dsc ? -1 : 1;
    }
    return 0;
  });
};
