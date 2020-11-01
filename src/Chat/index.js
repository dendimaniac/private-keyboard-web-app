import React, { useState, useEffect, useRef } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import axios from "axios";

import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";

const FunctionURL = "https://privatekeyboard.azurewebsites.net/api";
const Chat = () => {
  const [chat, setChat] = useState([]);
  const latestChat = useRef(null);

  latestChat.current = chat;
  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${FunctionURL}`)
      .withAutomaticReconnect()
      .build();

    connection.on("newMessage", (message) => {
      console.log("ReceiveMessage", message);
      const updatedChat = [...latestChat.current];
      updatedChat.push(message);
      setChat(updatedChat);
    });

    connection
      .start()
      .then(() => {
        console.log("Connected!");
      })
      .catch((e) => console.log("Connection failed: ", e));
  }, []);

  const sendMessage = async (user, message) => {
    const chatMessage = {
      user: user,
      message: message,
    };
    try {
      return await axios.post(`${FunctionURL}/messages`, {
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
