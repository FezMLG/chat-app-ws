import React from 'react';
import { IUser } from '../../interfaces/user';

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
