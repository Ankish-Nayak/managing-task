import { Pipe, PipeTransform } from '@angular/core';
import { TCOLS } from '../../../components/dashboard/todo-list/cols';
import { TEmployee } from '../../interfaces/employee.type';

@Pipe({
  name: 'userViewCols',
  standalone: true,
})
export class UserViewColsPipe implements PipeTransform {
  transform(cols: TCOLS, userType: TEmployee): TCOLS {
    return cols.filter((col) => {
      if (!col.render) {
        return false;
      }
      return (
        col.notAllowedUsers === null ||
        (col.notAllowedUsers && !col.notAllowedUsers.includes(userType))
      );
    });
  }
}
