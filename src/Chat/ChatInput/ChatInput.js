import React from "react";
import './ChatInput.css';

const ChatInput = (props) => {
  const {label, type} = props.input;
  let message = "";
  let timer = null;

  const onMessageUpdate = (e) => {
    message = e.target.value;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      props.sendMessage("#UserName", message);
    }, 1000);
  };

  return (
    <div className="form-input">
      <div className="label-input" >{label}:</div>
      <input
        className="input-message"
        type={type}
        id={Math.random()}
        name="message"
        onChange={(e) => {
          onMessageUpdate(e);
        }}
      />
    </div>
  );
};

export default ChatInput;
