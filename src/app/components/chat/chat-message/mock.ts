import { IMessage } from '../../../shared/interfaces/requests/chatbox.interface';

export const conversationData: IMessage[] = [
  {
    id: 1,
    message: "Hey Bob, how's it going?",
    name: 'Alice',
    userType: 'sender',
    isSeen: true,
    messageDate: '2024-02-09T09:00:00.000Z',
  },
  {
    id: 2,
    message: "Hi Alice! I'm doing well, thanks. How about you?",
    name: 'Bob',
    userType: 'receiver',
    isSeen: true,
    messageDate: '2024-02-09T09:05:00.000Z',
  },
  {
    id: 3,
    message: "I'm good too, just working on some stuff.",
    name: 'Alice',
    userType: 'sender',
    isSeen: true,
    messageDate: '2024-02-09T09:10:00.000Z',
  },
  {
    id: 4,
    message: "That's great. Anything interesting?",
    name: 'Bob',
    userType: 'receiver',
    isSeen: false,
    messageDate: '2024-02-09T09:15:00.000Z',
  },
  {
    id: 5,
    message: 'Not really, just some routine tasks.',
    name: 'Alice',
    userType: 'sender',
    isSeen: false,
    messageDate: '2024-02-09T09:20:00.000Z',
  },
  // Add more messages as needed
];
