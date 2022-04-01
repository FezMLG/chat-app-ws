import { Server } from 'socket.io';
import {
  IN_MESSAGE,
  GET_OLD_MESSAGES,
  OUT_MESSAGE,
  IN_OLD_MESSAGES,
  CLEAR_OLD_MESSAGES,
  CLEARED_OLD_MESSAGES,
  CONNECT_USER,
  DISCONNECT_USER,
} from '../consts';
import { IMessage } from '../interfaces/message';
import { IUser } from '../interfaces/user';

class Messages {
  messages: IMessage[] = [];
  constructor() {
    this.messages = [];
  }
  push(message: IMessage) {
    this.messages.push(message);
  }
  clear() {
    this.messages = [];
  }
  get() {
    return this.messages;
  }
}

class Users {
  users: IUser[] = [];
  constructor() {
    this.users = [];
  }
  push(user: IUser) {
    this.users.push(user);
  }
  delete(id: string) {
    this.users = this.users.filter((item) => item.userId !== id);
  }
  clear() {
    this.users = [];
  }
  get() {
    return this.users;
  }
}

export function setupHandlers(io: Server) {
  const messages = new Messages();
  const users = new Users();
  io.on('connection', (socket) => {
    console.log('Client connected', io.of('/').sockets.size);
    socket.join('General');
    socket.emit(
      'connected',
      {
        user: 'System',
        message: 'User Connected',
        timestamp: Date.now(),
      },
      socket.id
    );
    socket.on(CONNECT_USER, (arg: string) => {
      users.push({ userName: arg, userId: socket.id });
      socket.broadcast.emit(CONNECT_USER, { userName: arg, userId: socket.id });
    });
    socket.on('disconnect', (reason) => {
      socket.broadcast.emit(DISCONNECT_USER, {
        user: 'System',
        message: `User ${reason} has disconnected`,
        timestamp: Date.now(),
      });
    });
    socket.on(CLEAR_OLD_MESSAGES, () => {
      messages.clear();
      socket.emit(CLEARED_OLD_MESSAGES, messages.get());
    });
    socket.on(GET_OLD_MESSAGES, () => {
      socket.emit(IN_OLD_MESSAGES, messages.get(), users.get());
    });
    socket.on(OUT_MESSAGE, (arg: IMessage) => {
      messages.push(arg);
      socket.to('General').emit(IN_MESSAGE, arg);
    });
  });
}
