import { Server } from 'socket.io';
import {
  NEW_CLIENT_MESSAGE,
  GET_OLD_MESSAGES,
  IN_OLD_MESSAGES,
  CLEAR_OLD_MESSAGES,
  CLEARED_OLD_MESSAGES,
  CONNECT_USER,
  DISCONNECT_USER,
  JOIN_ROOM_REQUEST,
  JOIN_ROOM_ANSWER,
  LEAVE_ROOM_REQUEST,
  LEAVE_ROOM_ANSWER,
} from '../consts';
import { IMessage } from '../interfaces/message';
import { IRoom } from '../interfaces/room';
import { IUser } from '../interfaces/user';

class Rooms {
  rooms: IRoom[] = [];
  constructor() {
    this.rooms = [];
  }
  getRoom(name: string) {
    return this.rooms.find((room) => room.name == name);
  }
  getRooms() {
    return this.rooms;
  }
}

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
    socket.on(JOIN_ROOM_REQUEST, async (newRoom) => {
      await socket.join(newRoom);
      socket.emit(JOIN_ROOM_ANSWER, true, newRoom);
    });
    socket.on(LEAVE_ROOM_REQUEST, (oldRoom) => {
      socket.leave(oldRoom);
      socket.emit(LEAVE_ROOM_ANSWER, true, oldRoom);
    });

    // * old messages
    socket.on(CLEAR_OLD_MESSAGES, () => {
      messages.clear();
      socket.emit(CLEARED_OLD_MESSAGES, messages.get());
    });
    socket.on(GET_OLD_MESSAGES, () => {
      socket.emit(IN_OLD_MESSAGES, messages.get(), users.get());
    });

    // * sending messages
    socket.on(NEW_CLIENT_MESSAGE, (arg: IMessage) => {
      messages.push(arg);
      socket.rooms.forEach((room) => {
        socket.to(room).emit(NEW_CLIENT_MESSAGE, arg);
      });
    });

    // * on connect
    socket.on(CONNECT_USER, (arg: string) => {
      users.push({ userName: arg, userId: socket.id });
      socket.broadcast.emit(CONNECT_USER, { userName: arg, userId: socket.id });
    });
    // * on disconnect
    socket.on('disconnect', (reason) => {
      socket.broadcast.emit(DISCONNECT_USER, {
        user: 'System',
        message: `User ${reason} has disconnected`,
        timestamp: Date.now(),
      });
      users.delete(socket.id);
    });
  });
}
