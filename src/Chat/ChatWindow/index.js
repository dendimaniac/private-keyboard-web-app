import React from "react";

import Message from "./Message";

const ChatWindow = (props) => {
  console.log("propsChat", props.chat);
  const chat = props.chat.map((m) => (
    <Message
      key={Date.now() * Math.random()}
      sender={m.sender}
      text={m.text}
    />
  ));
  return <div>{chat}</div>;
};

export default ChatWindow;
