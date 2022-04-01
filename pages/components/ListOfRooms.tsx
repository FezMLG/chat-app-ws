import React from 'react';

export function ListOfRooms(
  rooms: string[],
  room: string,
  handleRoomChange: (e: any) => void
): React.ReactNode {
  return rooms?.map((value, index) => {
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
  });
}
