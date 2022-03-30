import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  GET_OLD_MESSAGES,
  IN_MESSAGE,
  OUT_MESSAGE,
  IN_OLD_MESSAGES,
  CLEAR_OLD_MESSAGES,
} from '../consts';
import { IMessage } from '../interfaces/message';

const DEBUG = false;

const Home: NextPage = () => {
  const [message, addMessage] = useState<string>();
  const [messages, addMessages] = useState<IMessage[]>([]);
  const scrollTo = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<Socket>();
  const [user, setUser] = useState<string>(
    `user ${String(Math.floor(Math.random() * 1000))}`
  );

  useEffect(() => {
    setTimeout(() => {
      addMessageToList({
        user: 'Local',
        message: '3sek',
        timestamp: Date.now(),
      });
    }, 3000);

    const socket = io();
    socket?.on('connected', (arg: IMessage) => {
      addMessages([]);
      addMessageToList(arg);
    });
    socket.emit(GET_OLD_MESSAGES);
    socket.on(IN_OLD_MESSAGES, (arg: IMessage[]) => {
      arg?.forEach((element: IMessage) => {
        addMessageToList(element);
      });
    });
    socket?.on(IN_MESSAGE, (arg: IMessage) => {
      if (arg) {
        addMessageToList(arg);
        console.log(arg);
      }
    });
    setSocket(socket);
  }, []);

  const handleSending = () => {
    if (message != null) {
      const createdMessage = {
        user,
        message,
        timestamp: Date.now(),
      };
      addMessage('');
      addMessageToList(createdMessage);
      socket?.emit(OUT_MESSAGE, createdMessage);
    }
    console.log(messages);
  };

  const addMessageToList = (mess: IMessage) => {
    mess.message = mess.message.trim();
    addMessages((prevState) => {
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
    addMessage(e.target.value);
  }

  function handleInputUser(e: React.ChangeEvent<HTMLInputElement>) {
    setUser(e.target.value);
  }

  function handleKeyPress(e: any) {
    if (e.key === 'Enter') {
      handleSending();
    }
  }

  function handleOldClearing() {
    socket?.emit(CLEAR_OLD_MESSAGES);
  }

  return (
    <div id="window" className={'h-full min-h-screen w-screen bg-slate-100'}>
      <div id="chat-window" className={'mx-auto max-w-xl gap-5 py-10'}>
        <div
          id="messages-container"
          className={
            'h-full h-96 max-h-96 w-full overflow-scroll rounded-md border-2 bg-slate-50 px-5 py-2'
          }
          onClick={() =>
            addMessageToList({
              user: 'Local',
              message: 'Clicked',
              timestamp: Date.now(),
            })
          }
        >
          {messages?.map((value, index) => {
            let whoAreU = 'text-black';
            let sender = value.user;
            if (value.user == user) {
              whoAreU = 'text-blue-600';
              sender = 'You';
            } else if (value.user == 'Local') {
              whoAreU = 'text-rose-900';
            } else if (value.user == 'System') {
              whoAreU = 'text-rose-500';
            }
            return (
              <div key={index} className={whoAreU}>
                ({sender}) {value.message}
                {DEBUG && '- ' + value.timestamp}
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
      </div>
    </div>
  );
};

export default Home;
