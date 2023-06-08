import React, { useState, useEffect, FC } from "react";
// import { Router, Route} from 'react-router-dom';
import "./App.css";
import io from "socket.io-client";

import BusComponent from "./BusComponent";

const socket = io("http://localhost:5000");
function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    socket.on("message", (message: string) => {
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    socket.emit("message", message);
    setMessage("");
  };

  return (
    <div>
      <h1>Flask Websockets Example</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
