import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { IN_MESSAGE, OUT_MESSAGE } from '../consts';
import { IMessage } from '../interfaces/message';

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
      addMessageToList({ user: 'System', message: '3sek' });
    }, 3000);

    const socket = io();
    socket?.on('connected', (arg: IMessage) => {
      addMessageToList(arg);
    });
    socket?.on(IN_MESSAGE, (arg) => {
      addMessageToList(arg);
      console.log(arg);
    });
    setSocket(socket);
  }, []);

  const handleSending = () => {
    if (message != null) {
      const createdMessage = {
        user,
        message,
        // timestamp: Date.now(),
      };
      addMessageToList(createdMessage);
      socket?.emit(OUT_MESSAGE, createdMessage);
    }
    console.log(messages);
  };

  const addMessageToList = (mess: IMessage) => {
    mess.message = mess.message.trim();
    addMessages((prevState) => {
      return [...prevState, mess];
    });
  };

  useEffect(() => {
    scrollTo.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });

    const mapMesseges = () => {};
  }, [messages]);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.value);
    addMessage(e.target.value);
  }

  function handleInputUser(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.value);
    setUser(e.target.value);
  }

  function handleKeyPress(e: any) {
    if (e.key === 'Enter') {
      handleSending();
      console.log(e.target.value);
    }
  }

  return (
    <div id="window" className={'h-full min-h-screen w-screen bg-slate-100'}>
      <div id="chat-window" className={'mx-auto max-w-xl gap-5 py-10'}>
        <div
          id="messages-container"
          className={
            'h-full h-96 max-h-96 w-full overflow-scroll rounded-md border-2 px-5 py-2'
          }
          onClick={() =>
            addMessageToList({ user: 'System', message: 'Connected' })
          }
        >
          {messages?.map((value, index) => {
            let whoAreU = 'text-black';
            let sender = value.user;
            if (value.user == user) {
              whoAreU = 'text-blue-600';
              sender = 'You';
            } else if (value.user == 'System') {
              whoAreU = 'text-rose-600';
              console.log(value.user);
            }
            return (
              <div key={index} className={whoAreU}>
                {value.message} - {sender}
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
            className={'h-full w-full rounded-md border-2 px-2'}
            onChange={handleInput}
            onKeyPress={handleKeyPress}
            value={message}
            autoComplete="off"
          />
          <button onClick={handleSending}>Send</button>
        </div>
        <input
          type={'text'}
          id={'user-name'}
          className={'h-full w-full rounded-md border-2 px-2'}
          onChange={handleInputUser}
          value={user}
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default Home;
