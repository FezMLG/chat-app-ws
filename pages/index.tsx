import {
  Snackbar,
  Alert,
  AlertColor,
  Switch,
  FormControlLabel,
  LinearProgress,
  Fade,
} from '@mui/material';
import type { NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  GET_OLD_MESSAGES,
  IN_MESSAGE,
  OUT_MESSAGE,
  IN_OLD_MESSAGES,
  CLEAR_OLD_MESSAGES,
  CONNECT_USER,
  DISCONNECT_USER,
} from '../consts';
import { IMessage } from '../interfaces/message';
import { IUser } from '../interfaces/user';

const Home: NextPage = () => {
  //TODO:
  //closing connection event
  //when fetching old messages, fetch connected users

  const [message, setMessage] = useState<string>('');
  const [room, setRoom] = useState<string>('General');
  const [rooms, setRooms] = useState<string[]>(['General', 'Welcome']);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const scrollTo = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<Socket>();
  const [user, setUser] = useState<string>(
    `user ${String(Math.floor(Math.random() * 1000))}`
  );
  const [users, setUsers] = useState<IUser[]>([]);
  const [open, setOpen] = useState<{
    message: string;
    isOpen: boolean;
    type: AlertColor;
  }>({
    message: 'Message',
    isOpen: false,
    type: 'info',
  });
  const [DEBUG, setDebug] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      DEBUG &&
        addMessageToList({
          user: 'Local',
          message: '3sek',
          timestamp: Date.now(),
        });
    }, 3000);

    const socket = io();
    socket?.once('connected', (arg: IMessage, arg2: string) => {
      setMessages([]);
      addMessageToList(arg);
      setOpen({
        message: 'Connected to server',
        isOpen: true,
        type: 'success',
      });
      setUsers((prev) => {
        return [...prev, { userName: user, userId: arg2 }];
      });
      setLoading(true);
    });
    socket.emit(CONNECT_USER, user);
    socket.on(CONNECT_USER, (arg: IUser) => {
      console.log('connected', arg);
      setUsers((prev) => {
        return [...prev, arg];
      });
    });
    socket.emit(GET_OLD_MESSAGES);
    socket.on(IN_OLD_MESSAGES, (messages: IMessage[], users: IUser[]) => {
      console.log(IN_OLD_MESSAGES, typeof messages, messages);
      if (messages?.length > 0) {
        messages.forEach((element: IMessage) => {
          addMessageToList(element);
        });
        setOpen({
          message: 'Loaded old messages',
          isOpen: true,
          type: 'success',
        });
      } else {
        setOpen({
          message: 'No old messages',
          isOpen: true,
          type: 'success',
        });
      }
      if (users?.length > 0) {
        setUsers((prevState) => {
          return [...prevState].concat(users);
        });
        setOpen({
          message: 'Loaded old messages',
          isOpen: true,
          type: 'success',
        });
      } else {
        setOpen({
          message: 'No old messages',
          isOpen: true,
          type: 'success',
        });
      }
      setLoading(false);
    });
    socket.on(DISCONNECT_USER, (arg: IMessage) => {
      if (arg) {
        console.log(IN_MESSAGE, arg);
        addMessageToList(arg);
      }
    });
    socket.on(IN_MESSAGE, (arg: IMessage) => {
      if (arg) {
        console.log(IN_MESSAGE, arg);
        addMessageToList(arg);
      }
    });
    socket.on('disconnect', function () {
      setOpen({
        message: 'Disconnected from server',
        isOpen: true,
        type: 'error',
      });
    });
    setSocket(socket);
  }, []);

  const handleSending = () => {
    if (message != null) {
      if (message.length > 500) {
        setOpen({
          message: 'Message is longer than 500 characters',
          isOpen: true,
          type: 'error',
        });
      } else {
        const createdMessage = {
          user,
          message,
          timestamp: Date.now(),
        };
        setMessage('');
        addMessageToList(createdMessage);
        socket?.emit(OUT_MESSAGE, createdMessage);
      }
    }
    console.log(messages);
  };

  const addMessageToList = (mess: IMessage) => {
    mess.message = mess.message.trim();
    setMessages((prevState) => {
      return [...prevState, mess].sort((a, b) => {
        return a.timestamp - b.timestamp;
      });
    });
  };

  useEffect(() => {
    scrollTo.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [messages]);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setMessage(e.target.value);
  }

  function handleInputUser(e: React.ChangeEvent<HTMLInputElement>) {
    setUser(e.target.value);
  }

  function handleKeyPress(e: any) {
    if (e.key === 'Enter') {
      handleSending();
    }
  }

  const handleRoomChange = (e: any) => {
    setRoom(e.target.value);
    console.log(room);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen((prevState) => ({
      ...prevState,
      isOpen: false,
    }));
  };

  function handleOldClearing() {
    socket?.emit(CLEAR_OLD_MESSAGES);
  }

  return (
    <div id="window" className={'h-full min-h-screen w-screen bg-slate-100'}>
      <div id={'app-container'} className={'mx-auto max-w-5xl pt-12'}>
        <div
          id={'user-window'}
          className={
            'flex h-96 max-h-96 w-48 max-w-xs flex-col flex-nowrap gap-2.5 overflow-y-auto rounded-md border-2 bg-slate-50 px-5 py-2'
          }
        >
          <span className={'font-semibold'}>List Of Users</span>
          <div>
            {users?.map((value, index) => {
              let whoAreU = 'text-black';
              if (value.userName == user) {
                whoAreU = 'text-blue-600';
              }
              return (
                <p key={index} className={whoAreU}>
                  {value.userName}
                </p>
              );
            })}
          </div>
        </div>
        <div id="chat-window" className={'mx-auto w-full max-w-xl gap-5'}>
          <div
            id="messages-container"
            className={
              'flex h-96 max-h-96 w-full flex-col flex-nowrap gap-2.5 overflow-y-auto rounded-md border-2 bg-slate-50 px-5 py-2'
            }
            onClick={() =>
              DEBUG &&
              addMessageToList({
                user: 'Local',
                message: 'Clicked',
                timestamp: Date.now(),
              })
            }
          >
            <Fade in={loading} unmountOnExit>
              <LinearProgress />
            </Fade>

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
            <div ref={scrollTo} />
          </div>
          <div
            id="input-container"
            className={'sticky bottom-0 flex w-full flex-row gap-5'}
          >
            <input
              type={'text'}
              id={'user-message'}
              placeholder={'Your Message'}
              className={'h-full w-full rounded-md border-2 px-2'}
              onChange={handleInput}
              onKeyPress={handleKeyPress}
              value={message}
              autoComplete="off"
            />
            <button
              onClick={handleSending}
              className={'mr-5 rounded-md bg-sky-600 px-5 text-white'}
            >
              Send
            </button>
          </div>
          <input
            type={'text'}
            id={'user-name'}
            placeholder={'User name'}
            className={'h-full w-full rounded-md border-2 px-2'}
            onChange={handleInputUser}
            value={user}
            autoComplete="off"
          />
          <button
            onClick={handleOldClearing}
            className={
              'underline decoration-blue-500 decoration-2 underline-offset-1'
            }
          >
            Clear Old Messages
          </button>
          <FormControlLabel
            control={
              <Switch
                checked={DEBUG}
                onChange={() => setDebug((prev) => !prev)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label="Debug Mode"
          />
        </div>
        <div
          id={'room-window'}
          className={
            'flex h-96 max-h-96 w-48 max-w-xs flex-col flex-nowrap gap-2.5 overflow-y-auto rounded-md border-2 bg-slate-50 px-5 py-2'
          }
        >
          <span className={'font-semibold'}>List Of Rooms</span>
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
        </div>
      </div>
      <Snackbar
        open={open.isOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={open.type}
          sx={{ width: '100%' }}
        >
          {open.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Home;
