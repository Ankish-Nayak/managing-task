import { Pipe, PipeTransform } from '@angular/core';
import { ICard } from '../../../components/dashboard/dashboard.component';
import { USER_ROLES } from '../../../utils/constants';

@Pipe({
  name: 'userViewDashboardDetail',
  standalone: true,
})
export class UserViewDashboardDetailPipe implements PipeTransform {
  transform(cards: ICard[], userType: USER_ROLES): ICard[] {
    return cards.filter((card) => {
      return card.allowedUsers.includes(userType);
    });
  }
}
