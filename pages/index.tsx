import Messages from './components/Messages/';
import UserMessageInput from './../UserMessageInput';
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
  NEW_CLIENT_MESSAGE,
  IN_OLD_MESSAGES,
  CLEAR_OLD_MESSAGES,
  CONNECT_USER,
  DISCONNECT_USER,
  CHANGE_ROOM_REQUEST,
  CHANGE_ROOM_ANSWER,
  GET_ROOM_USERS,
  LEAVE_ROOM_ANSWER,
  LEAVE_ROOM_REQUEST,
  JOIN_ROOM_REQUEST,
} from '../consts';
import { IMessage } from '../interfaces/message';
import { IUser } from '../interfaces/user';
import ListOfMessages from './components/Messages/ListOfMessages';
import Users from './components/Users';
import Rooms from './components/Rooms';

const Home: NextPage = () => {
  //TODO:
  //closing connection event
  //when fetching old messages, fetch connected users

  const [activeRoom, setActiveRoom] = useState<string>('General');
  const [availableRooms, setAvailableRooms] = useState<string[]>([
    'General',
    'Welcome',
  ]);
  const [messages, setMessages] = useState<IMessage[]>([]);
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

    // * initialize
    socket.emit(CONNECT_USER, user);
    socket.emit(JOIN_ROOM_REQUEST, activeRoom);

    // * other user connect
    socket.on(CONNECT_USER, (arg: IUser) => {
      console.log('connected', arg);
      setUsers((prev) => {
        return [...prev, arg];
      });
    });

    // * room change
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
    socket.on(CHANGE_ROOM_ANSWER, (answer: boolean, newRoom: string) => {
      if (answer) {
        setOpen({
          message: `Connected to room ${newRoom}`,
          isOpen: true,
          type: 'success',
        });
        setActiveRoom(newRoom);
        socket.emit(GET_OLD_MESSAGES);
        socket.emit(GET_ROOM_USERS);
        setMessages([]);
        setUsers([]);
        console.log('connected to room', newRoom);
      } else {
        setOpen({
          message: `Failed to connect to room ${newRoom}`,
          isOpen: true,
          type: 'error',
        });
        console.log('failed to connect to room', newRoom);
      }
    });

    // * new message
    socket.on(NEW_CLIENT_MESSAGE, (arg: IMessage) => {
      if (arg) {
        console.log(NEW_CLIENT_MESSAGE, arg);
        addMessageToList(arg);
      }
    });

    // * disconnecting this user
    socket.on('disconnect', function () {
      setOpen({
        message: 'Disconnected from server',
        isOpen: true,
        type: 'error',
      });
    });

    // * disconecting other user
    socket.on(DISCONNECT_USER, (arg: IMessage) => {
      if (arg) {
        console.log(NEW_CLIENT_MESSAGE, arg);
        addMessageToList(arg);
      }
    });
    setSocket(socket);
  }, []);

  const addMessageToList = (mess: IMessage) => {
    mess.message = mess.message.trim();
    setMessages((prevState) => {
      return [...prevState, mess].sort((a, b) => {
        return a.timestamp - b.timestamp;
      });
    });
  };

  const handleInputUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(e.target.value);
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

  const handleOldClearing = () => {
    socket?.emit(CLEAR_OLD_MESSAGES);
  };

  return (
    <div id="window" className={'h-full min-h-screen w-screen bg-slate-100'}>
      <div id={'app-container'} className={'mx-auto max-w-5xl pt-12'}>
        <Users users={users} user={user} />
        <div id="chat-window" className={'mx-auto w-full max-w-xl gap-5'}>
          <Messages
            loading={loading}
            messages={messages}
            user={user}
            DEBUG={DEBUG}
            addMessageToList={addMessageToList}
            socket={socket}
            // setOpen={setOpen}
          />
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
        <Rooms rooms={availableRooms} activeRoom={activeRoom} socket={socket} />
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
