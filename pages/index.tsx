import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from "react";

const Home: NextPage = () => {
  const [message, addMessage] = useState<string>();
  const [messages, addMessages] = useState<string[]>([])
  const scrollTo = useRef<HTMLDivElement>(null)

  const handleSending = () => {
    if (message != null) {
      addMessageToList(message);
    }
    console.log(messages);
  }

  const addMessageToList = (mess: string) => {
    mess.trim();
    addMessages(prevState => {
      return [
        ...prevState,
        mess
      ]
    });
    addMessage("")
  }

  useEffect(()=>{
    setTimeout(()=>{
      addMessageToList("3sek")
    }, 3000)
  }, [])

  useEffect(()=>{
    scrollTo.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    })
  }, [messages])

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.value);
    addMessage(e.target.value);
  }

  function handleKeyPress(e: any){
    if(e.key === 'Enter'){
      handleSending();
      console.log(e.target.value);
    }
  }

  return (
    <div id="window" className={"w-screen h-full min-h-screen bg-slate-100"}>
      <div id="chat-window" className={"max-w-xl mx-auto gap-5 py-10"}>
        <div
          id="messages-container"
          className={"w-full h-full h-96 max-h-96 rounded-md border-2 overflow-scroll px-5 py-2"}
          onClick={() => addMessageToList("mess")}
        >
          {messages?.map((value, index)=>{
            return(
              <div key={index}>{value}</div>
            )
          })}
          <div ref={scrollTo}/>
        </div>
        <div id="input-container" className={"flex flex-row sticky bottom-0 w-full gap-5"}>
          <input
            type={"text"}
            id={"user-message"}
            className={"h-full w-full rounded-md border-2 px-2"}
            onChange={handleInput}
            onKeyPress={handleKeyPress}
            value={message} autoComplete="off"
          />
          <button onClick={handleSending}>Send</button>
        </div>
      </div>
    </div>
  )
}

export default Home
