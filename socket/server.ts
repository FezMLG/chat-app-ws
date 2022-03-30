import { Server } from 'socket.io';
import { IN_MESSAGE, OUT_MESSAGE } from '../consts';

export function setupHandlers(io: Server) {
  io.on('connection', (socket) => {
    console.log('Client connected');
    io.emit('Yo');
    socket.on(OUT_MESSAGE, (arg) => {
      console.log(arg);
      socket.broadcast.emit(IN_MESSAGE, arg);
    });
  });
}
