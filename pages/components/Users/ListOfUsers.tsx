import React, { FunctionComponent } from 'react';
import { IUser } from '../../../interfaces/user';

const ListOfUsers: FunctionComponent<{
  users: IUser[];
  user: string;
}> = ({ users, user }) => {
  return (
    <div>
      {users?.map((value, index) => {
        let whoAreU = 'text-black';
        if (value.name == user) {
          whoAreU = 'text-blue-600';
        }
        return (
          <p key={index} className={whoAreU}>
            {value.name}
          </p>
        );
      })}
    </div>
  );
};

export default ListOfUsers;
