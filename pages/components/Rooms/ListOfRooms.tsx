import React, { FunctionComponent } from 'react';
import { CHANGE_ROOM_REQUEST } from '../../../consts';
import { Socket } from 'socket.io-client';

const ListOfRooms: FunctionComponent<{
  rooms: string[];
  activeRoom: string;
  socket: Socket | undefined;
}> = ({ rooms, activeRoom, socket }) => {
  const handleRoomChange = (e: any) => {
    socket?.emit(CHANGE_ROOM_REQUEST, activeRoom, e.target.value);
  };

  return (
    <div className={'flex flex-col flex-wrap content-start items-start'}>
      {rooms?.map((value, index) => {
        let selected = '';
        if (value == activeRoom) {
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
