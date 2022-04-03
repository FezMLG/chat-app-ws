import { IUser } from './user';

export interface IMessage {
  id: string;
  user: string;
  timestamp: number;
  message: string;
}
