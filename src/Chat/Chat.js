import React, {useEffect} from "react";
import {HubConnectionBuilder} from "@microsoft/signalr";
import axios from "axios";
import {useLocation} from "react-router-dom";
import queryString from "query-string";

import ChatInput from "./ChatInput/ChatInput";

const FunctionURL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEVELOPMENT_FUNCTION
    : process.env.REACT_APP_PRODUCTION_FUNCTION;

const Chat = () => {
  const location = useLocation();
  const query = queryString.parse(location.search);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${FunctionURL}`)
      .withAutomaticReconnect()
      .build();

    connection.on("newMessage", (message) => {
      console.log("ReceiveMessage", message);
    });

    connection
      .start()
      .then((res) => {
        console.log("Connected!");
        if (query.uuid) {
          axios.post(`${FunctionURL}/confirmqrscan`, {uuid: query.uuid});
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
    let inputArray = Array.from(Array(Number(query.amount)));
    inputArray = inputArray.map(el => {
      return {label: "First name", type: "text"}
    })
    return inputArray.map((input, index) => {
      return <ChatInput input={input} key={index} sendMessage={sendMessage} />;
    });
  };

  const hasEnoughRequiredQuery =
    query.amount && Number(query.amount) > 0 && query.uuid;

  return (
    <>
      {hasEnoughRequiredQuery && (
        <div>
          <h1>Connected!</h1>
          <DisplayInputs />
          <hr />
        </div>
      )}
    </>
  );
};

export default Chat;
