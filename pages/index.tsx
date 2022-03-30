import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from "react";

const Home: NextPage = () => {
  const [message, addMessage] = useState<String>();
  const [messages, addMessages] = useState<String[]>([])

  const handleSending = () => {
    console.log("message send");
    if (message != null) {
      addMessages(prevState => {
        return [
          ...prevState,
          message
        ]
      })
    }
    console.log(messages);
  }

  function handleInput(e: any) {
    console.log(e.target.value);
    addMessage(e.target.value);
  }

  return (
    <div id="window">
      <div id="chat-window">
        <div id="messages-container">
          {messages?.map((value, index)=>{
            return(
              <div key={index}>{value}</div>
            )
          })}
        </div>
        <div id="input-container">
          <input type={"text"} id={"user-message"} onChange={handleInput}/>
          <button onClick={handleSending}>Send</button>
        </div>
      </div>
    </div>
  )
}

export default Home
