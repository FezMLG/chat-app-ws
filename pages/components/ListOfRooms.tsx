import React, { FunctionComponent } from 'react';
import { JOIN_ROOM_REQUEST } from '../../consts';
import { Socket } from 'socket.io-client';

const ListOfRooms: FunctionComponent<{
  rooms: string[];
  room: string;
  socket: Socket | undefined;
}> = ({ rooms, room, socket }) => {
  const handleRoomChange = (e: any) => {
    socket?.emit(JOIN_ROOM_REQUEST, e.target.value);
  };

  return (
    <div className={'flex flex-col flex-wrap content-start items-start'}>
      {rooms?.map((value, index) => {
        let selected = '';
        if (value == room) {
          selected = ` before:content-['🙄'] before:pr-2 text-cyan-600	`;
        }
        return (
          <button
            key={index}
            className={selected}
            onClick={handleRoomChange}
            value={value}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
};

export default ListOfRooms;
