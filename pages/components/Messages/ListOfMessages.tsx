import React, { FunctionComponent } from 'react';
import { IMessage } from '../../../interfaces/message';

const ListOfMessages: FunctionComponent<{
  messages: IMessage[];
  user: string;
  DEBUG: boolean;
}> = ({ messages, user, DEBUG }) => {
  return (
    <>
      {messages?.map((value, index) => {
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
      })}
    </>
  );
};

export default ListOfMessages;
