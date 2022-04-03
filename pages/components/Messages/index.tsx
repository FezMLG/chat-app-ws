import { AlertColor, Fade, LinearProgress } from '@mui/material';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { NEW_CLIENT_MESSAGE } from '../../../consts';
import { IMessage } from '../../../interfaces/message';
import UserMessageInput from '../../../UserMessageInput';
import ListOfMessages from './ListOfMessages';
import { v4 as uuidv4 } from 'uuid';

const Messages: FunctionComponent<{
  loading: boolean;
  messages: IMessage[];
  user: string;
  DEBUG: boolean;
  addMessageToList: (mess: IMessage) => void;
  socket: Socket | undefined;
  // setOpen: ({
  //   message: string;
  //   isOpen: boolean;
  //   type: AlertColor;
  // }) => void;
}> = ({
  loading,
  messages,
  user,
  DEBUG,
  addMessageToList,
  socket,
  // setOpen,
}) => {
  const [message, setMessage] = useState<string>('');
  const scrollTo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollTo.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [messages]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      handleSending();
    }
  };

  const handleSending = () => {
    if (message != null) {
      if (message.length > 500) {
        // setOpen({
        //   message: 'Message is longer than 500 characters',
        //   isOpen: true,
        //   type: 'error',
        // });
      } else {
        const createdMessage = {
          id: uuidv4(),
          user,
          timestamp: Date.now(),
          message,
        };
        setMessage('');
        addMessageToList(createdMessage);
        socket?.emit(NEW_CLIENT_MESSAGE, createdMessage);
      }
    }
    console.log(messages);
  };

  return (
    <>
      {' '}
      <div
        id="messages-container"
        className={
          'flex h-96 max-h-96 w-full flex-col flex-nowrap gap-2.5 overflow-y-auto rounded-md border-2 bg-slate-50 px-5 py-2'
        }
      >
        <Fade in={loading} unmountOnExit>
          <LinearProgress />
        </Fade>
        <ListOfMessages messages={messages} user={user} DEBUG={DEBUG} />
        <div ref={scrollTo} />
      </div>
      <UserMessageInput
        handleInput={handleInput}
        handleKeyPress={handleKeyPress}
        message={message}
        handleSending={handleSending}
      />
    </>
  );
};

export default Messages;
