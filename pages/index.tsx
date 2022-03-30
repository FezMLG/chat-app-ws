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
  const [user, setUser] = useState<string>('test');

  useEffect(() => {
    setTimeout(() => {
      addMessageToList('3sek');
    }, 3000);

    const socket = io();
    socket.on('connect', () => {
      const engine = socket.io.engine;
      console.log(engine.transport.name);
      engine.once('upgrade', () => {
        console.log(engine.transport.name);
      });
      addMessageToList('Connected');
    });
    setSocket(socket);
  }, []);

  useEffect(() => {
    socket?.on(IN_MESSAGE, (arg) => {
      addMessageToList(arg);
    });
  }, [socket]);

  const handleSending = () => {
    if (message != null) {
      addMessageToList(message);
      socket?.emit(OUT_MESSAGE, {
        user: user,
        message,
      });
    }
    console.log(messages);
  };

  const addMessageToList = (mess: string) => {
    mess.trim();
    addMessages((prevState) => {
      return [
        ...prevState,
        {
          user: user,
          message: mess,
        },
      ];
    });
    addMessage('');
  };

  useEffect(() => {
    scrollTo.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [messages]);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.value);
    addMessage(e.target.value);
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
          onClick={() => addMessageToList('mess')}
        >
          {messages?.map((value, index) => {
            return <div key={index}>{value.message}</div>;
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
      </div>
    </div>
  );
};

export default Home;
