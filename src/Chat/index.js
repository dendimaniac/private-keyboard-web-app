import React, { useState, useEffect, useRef } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import axios from "axios";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";

const FunctionURL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEVELOPMENT_FUNCTION
    : process.env.REACT_APP_PRODUCTION_FUNCTION;

const Chat = () => {
  const [chat, setChat] = useState([]);
  const latestChat = useRef(null);
  const location = useLocation();
  const query = queryString.parse(location.search);

  latestChat.current = chat;
  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${FunctionURL}`)
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
        if (query.uuid) {
          axios.post(`${FunctionURL}/confirmqrscan`, { uuid: query.uuid });
        }
      })
      .catch((e) => console.log("Connection failed: ", e));
  }, [query.uuid]);

  const sendMessage = async (user, message) => {
    try {
      return await axios.post(`${FunctionURL}/messages`, {
        sender: user,
        text: message,
        uuid: query.uuid,
      });
    } catch (e) {
      console.log("Sending message failed.", e);
    }
  };

  const DisplayInputs = () => {
    const inputArray = Array.from(Array(Number(query.amount)));
    return inputArray.map((_, index) => {
      return <ChatInput key={index} sendMessage={sendMessage} />;
    });
  };

  const hasEnoughRequiredQuery =
    query.amount && Number(query.amount) > 0 && query.uuid;

  return (
    <>
      {hasEnoughRequiredQuery && (
        <div>
          <DisplayInputs />
          <hr />
          <ChatWindow chat={chat} />
        </div>
      )}
    </>
  );
};

export default Chat;
