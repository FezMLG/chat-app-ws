import { Server } from 'socket.io';
import {
  IN_MESSAGE,
  GET_OLD_MESSAGES,
  OUT_MESSAGE,
  IN_OLD_MESSAGES,
  CLEAR_OLD_MESSAGES,
} from '../consts';
import { IMessage } from '../interfaces/message';

let messages: IMessage[] = [];

export function setupHandlers(io: Server) {
  io.on('connection', (socket) => {
    console.log('Client connected', io.of('/').sockets.size);
    socket.emit('connected', {
      user: 'System',
      message: 'User Connected',
      timestamp: Date.now(),
    });
    socket.on(CLEAR_OLD_MESSAGES, () => {
      messages = [];
    });
    socket.on(GET_OLD_MESSAGES, () => {
      socket.emit(IN_OLD_MESSAGES, messages);
    });
    socket.on(OUT_MESSAGE, (arg: IMessage) => {
      messages.push(arg);
      socket.broadcast.emit(IN_MESSAGE, arg);
    });
  });
}
