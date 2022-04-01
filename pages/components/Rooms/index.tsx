import React, { FunctionComponent } from 'react';
import { Socket } from 'socket.io-client';
import ListOfRooms from './ListOfRooms';
const Rooms: FunctionComponent<{
  rooms: string[];
  room: string;
  socket: Socket | undefined;
}> = ({ rooms, room, socket }) => {
  return (
    <div
      id={'room-window'}
      className={
        'flex h-96 max-h-96 w-48 max-w-xs flex-col flex-nowrap gap-2.5 overflow-y-auto rounded-md border-2 bg-slate-50 px-5 py-2'
      }
    >
      <span className={'font-semibold'}>List Of Rooms</span>
      <ListOfRooms rooms={rooms} room={room} socket={socket} />
    </div>
  );
};

export default Rooms;
