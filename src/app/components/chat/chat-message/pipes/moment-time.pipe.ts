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
    return istTimestamp.format('HH:mm');
  }
}
