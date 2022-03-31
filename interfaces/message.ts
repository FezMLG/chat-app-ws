import { IUser } from './user';

export interface IMessage {
  user: string;
  message: string;
  timestamp: number;
  id?: string;
}
