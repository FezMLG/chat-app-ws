import React, { FunctionComponent } from 'react';
import { IUser } from '../../../interfaces/user';
import ListOfUsers from './ListOfUsers';

const Users: FunctionComponent<{
  users: IUser[];
  user: string;
}> = ({ users, user }) => {
  return (
    <div
      id={'user-window'}
      className={
        'flex h-96 max-h-96 w-48 max-w-xs flex-col flex-nowrap gap-2.5 overflow-y-auto rounded-md border-2 bg-slate-50 px-5 py-2'
      }
    >
      <span className={'font-semibold'}>List Of Users</span>
      <ListOfUsers users={users} user={user} />
    </div>
  );
};

export default Users;
