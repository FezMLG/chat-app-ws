import { Server } from 'socket.io';
import {
  IN_MESSAGE,
  GET_OLD_MESSAGES,
  OUT_MESSAGE,
  IN_OLD_MESSAGES,
  CLEAR_OLD_MESSAGES,
  CLEARED_OLD_MESSAGES,
} from '../consts';
import { IMessage } from '../interfaces/message';

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

export function setupHandlers(io: Server) {
  const messages = new Messages();
  io.on('connection', (socket) => {
    console.log('Client connected', io.of('/').sockets.size);
    socket.emit('connected', {
      user: 'System',
      message: 'User Connected',
      timestamp: Date.now(),
    });
    socket.on(CLEAR_OLD_MESSAGES, () => {
      messages.clear();
      socket.emit(CLEARED_OLD_MESSAGES, messages.get());
    });
    socket.on(GET_OLD_MESSAGES, () => {
      socket.emit(IN_OLD_MESSAGES, messages.get());
    });
    socket.on(OUT_MESSAGE, (arg: IMessage) => {
      messages.push(arg);
      socket.broadcast.emit(IN_MESSAGE, arg);
    });
  });
}
