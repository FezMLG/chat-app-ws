import React from 'react';
import { IMessage } from '../../interfaces/message';
import { IUser } from '../../interfaces/user';

export function ListOfMessages(
  messages: IMessage[],
  user: string,
  DEBUG: boolean
): React.ReactNode {
  return messages?.map((value, index) => {
    let whoAreU = 'text-black';
    let sender = value.user;
    let position = 'self-start text-left';
    if (value.user == user) {
      whoAreU = 'text-blue-600';
      sender = 'You';
      position = 'self-end text-right';
    } else if (value.user == 'Local') {
      whoAreU = 'text-rose-900';
      position = 'self-center text-center';
    } else if (value.user == 'System') {
      whoAreU = 'text-rose-500';
      position = 'self-center text-center';
    }
    return (
      <div key={index} className={`flex w-full flex-col`}>
        <p className={`${whoAreU} ${position} flex w-9/12 flex-col`}>
          <span className={'text-xs'}>{sender}</span>
          <span>{value.message}</span>
          {DEBUG && value.timestamp}
        </p>
      </div>
    );
  });
}
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
export function ListOfUsers(users: IUser[], user: string): React.ReactNode {
  return users?.map((value, index) => {
    let whoAreU = 'text-black';
    if (value.userName == user) {
      whoAreU = 'text-blue-600';
    }
    return (
      <p key={index} className={whoAreU}>
        {value.userName}
      </p>
    );
  });
}
