import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'momentTime',
  standalone: true,
})
export class MomentTimePipe implements PipeTransform {
  transform(isoTime: string): string {
    const originalTimestamp = moment.utc(isoTime);
    const istTimestamp = originalTimestamp.tz('Asia/Kolkata');
    // const currentDateIST = moment().tz('Asia/Kolkata');
    return istTimestamp.format('HH:mm');
    // if (istTimestamp.isSame(currentDateIST.clone().subtract(1, 'day'), 'day')) {
    //   return 'Yesterday';
    // }
    // if (!moment().isSame(istTimestamp, 'day')) {
    //   return istTimestamp.format('DD/MM/YY');
    // } else {
    //   return istTimestamp.format('HH:mm');
    // }
  }
}
