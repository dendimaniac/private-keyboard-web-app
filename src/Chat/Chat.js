import React, { useState, useEffect, useRef } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import axios from "axios";

import ChatWindow from "./ChatWindow/ChatWindow";
import ChatInput from "./ChatInput/ChatInput";

const Chat = () => {
  const [chat, setChat] = useState([]);
  const latestChat = useRef(null);

  latestChat.current = chat;
  console.log("latestChat", chat);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:7071/api")
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then((result) => {
        console.log("Connected!");

        connection.on("ReceiveMessage", (message) => {
          console.log("ReceiveMessage", message);
          const updatedChat = [...latestChat.current];
          updatedChat.push(message);
          setChat(updatedChat);
        });
      })
      .catch((e) => console.log("Connection failed: ", e));
  }, []);

  const sendMessage = async (user, message) => {
    const chatMessage = {
      user: user,
      message: message,
    };

    try {
      return await axios.post("http://localhost:7071/api/messages", {
        sender: chatMessage.user,
        text: chatMessage.message,
      });
    } catch (e) {
      console.log("Sending message failed.", e);
    }
  };

  return (
    <div>
      <ChatInput sendMessage={sendMessage} />
      <hr />
      <ChatWindow chat={chat} />
    </div>
  );
};

export default Chat;
