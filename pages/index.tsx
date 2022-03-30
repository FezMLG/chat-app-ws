import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from "react";

const Home: NextPage = () => {
  const [message, addMessage] = useState<string>();
  const [messages, addMessages] = useState<string[]>([])

  const handleSending = () => {
    console.log("message send");
    if (message != null) {
      addMessages(prevState => {
        return [
          ...prevState,
          message
        ]
      })
      addMessage("")
    }
    console.log(messages);
  }

  function handleInput(e: any) {
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
    <div id="window" className={"w-screen h-screen bg-slate-100"}>
      <div id="chat-window">
        <div id="messages-container">
          {messages?.map((value, index)=>{
            return(
              <div key={index}>{value}</div>
            )
          })}
        </div>
        <div id="input-container">
          <input type={"text"} id={"user-message"} onChange={handleInput} onKeyPress={handleKeyPress} value={message}/>
          <button onClick={handleSending}>Send</button>
        </div>
      </div>
    </div>
  )
}

export default Home
