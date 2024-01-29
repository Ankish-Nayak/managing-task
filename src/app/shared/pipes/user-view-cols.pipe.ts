import { Pipe, PipeTransform } from '@angular/core';
import { TCOLS } from '../../components/dashboard/todo-list/cols';
import { TEmployee } from '../interfaces/employee.type';

@Pipe({
  name: 'userViewCols',
  standalone: true,
})
export class UserViewColsPipe implements PipeTransform {
  transform(cols: TCOLS, userType: TEmployee): TCOLS {
    // const col = this.cols.find((e) => e.name === colName);
    //    console.log(col);
    //    return (
    //      col !== undefined &&
    //      (col.notAllowedUsers === null ||
    //        (col.notAllowedUsers !== null &&
    //          col.notAllowedUsers.includes(this.userType)))
    //    );
    return cols.filter(
      (col) =>
        col.notAllowedUsers === null ||
        (col.notAllowedUsers && !col.notAllowedUsers.includes(userType)),
    );
  }
}
