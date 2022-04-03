import { RedisClientType, RedisScripts } from 'redis';
import { Server } from 'socket.io';
import {
  NEW_CLIENT_MESSAGE,
  GET_OLD_MESSAGES,
  IN_OLD_MESSAGES,
  CLEAR_OLD_MESSAGES,
  CLEARED_OLD_MESSAGES,
  CONNECT_USER,
  DISCONNECT_USER,
  CHANGE_ROOM_REQUEST,
  CHANGE_ROOM_ANSWER,
  LEAVE_ROOM_REQUEST,
  LEAVE_ROOM_ANSWER,
  JOIN_ROOM_REQUEST,
} from '../consts';
import { IMessage } from '../interfaces/message';
import { IRoom } from '../interfaces/room';
import { IUser } from '../interfaces/user';
import createRedis from '../server/createRedis';

export async function setupHandlers(io: Server, client: any) {
  await createRedis(client);

  // const messages = [];
  // const users = [];
  io.on('connection', (socket) => {
    console.log('Client connected', io.of('/').sockets.size);
    socket.emit(
      'connected',
      {
        user: 'System',
        message: 'User Connected',
        timestamp: Date.now(),
      },
      socket.id
    );

    // * rooms
    socket.on(JOIN_ROOM_REQUEST, (newRoom: any) => {
      socket.join(newRoom);
      socket.emit(CHANGE_ROOM_ANSWER, true, newRoom);
    });
    socket.on(CHANGE_ROOM_REQUEST, (oldRoom, newRoom) => {
      socket.leave(oldRoom);
      socket.join(newRoom);
      socket.emit(CHANGE_ROOM_ANSWER, true, newRoom);
    });

    // * old messages
    socket.on(CLEAR_OLD_MESSAGES, () => {
      // messages.clear();
      // socket.emit(CLEARED_OLD_MESSAGES, messages.get());
    });
    socket.on(GET_OLD_MESSAGES, () => {
      // socket.emit(IN_OLD_MESSAGES, messages.get(), users.get());
    });

    // * sending messages
    socket.on(NEW_CLIENT_MESSAGE, (arg: IMessage) => {
      // messages.push(arg);
      socket.rooms.forEach(async (room) => {
        socket.to(room).emit(NEW_CLIENT_MESSAGE, arg);
        console.log(room, arg);
        await client.json.arrAppend('Rooms', `$.${room}.ListOfMessages`, arg);
      });
    });

    // * on connect
    socket.on(CONNECT_USER, (arg: string) => {
      // users.push({ userName: arg, userId: socket.id });
      socket.broadcast.emit(CONNECT_USER, { userName: arg, userId: socket.id });
    });
    // * on disconnect
    socket.on('disconnect', (reason) => {
      socket.broadcast.emit(DISCONNECT_USER, {
        user: 'System',
        message: `User ${reason} has disconnected`,
        timestamp: Date.now(),
      });
      // users.delete(socket.id);
    });
  });
}
