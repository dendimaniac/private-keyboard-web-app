import React from "react";
import "./ChatInput.css";

const ChatInput = ({ inputSetting, sendMessage, position }) => {
  let message = "";
  let timer = null;

  const onMessageUpdate = (e) => {
    message = e.target.value;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      sendMessage(position, message);
    }, 250);
  };

  return (
    <div className="form-input">
      <div className="label-input">{inputSetting.label}:</div>
      <input
        className="input-message"
        type={inputSetting.type}
        placeholder={inputSetting.placeholder}
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
