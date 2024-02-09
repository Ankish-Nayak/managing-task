export interface IDeleteApiRes {
  status: string;
  message: string;
  statusCode: number;
}

export interface ISendMessage {
  status: string;
  message: string;
  statusCode: number;
}

export interface IGetChatBoxRes {
  status: string;
  message: string;
  statusCode: number;
  iterableData: IChatBox[];
}

export interface IChatBox {
  employeeId: number;
  employeeName: string;
  lastMessage: string;
  isSeen: boolean;
  newMessages: number;
  recieverId: number;
  recieverName: string;
  lastActive: string; // Assuming lastActive is in ISO format
}

export interface IDisplayMessage {
  status: string;
  message: string;
  statusCode: number;
  iterableData: IMessage[];
}

export interface IMessage {
  id: number;
  message: string;
  name: string;
  userType: string;
  isSeen: boolean;
  messageDate: string; // Assuming messageDate is in ISO format
}
