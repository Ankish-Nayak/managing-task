import { NotificationType } from './constants';

export const getNotificationType = (notification: string): NotificationType => {
  const keys = Object.keys(NotificationType) as NotificationType[];
  const words = notification.split(' ');
  const res = NotificationType.Completed;
  for (const key of keys) {
    if (words.includes(key)) {
      return key;
    }
  }
  return res;
};
