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
  console.log("inputSetting", inputSetting);
  return (
    <div className="form-input">
      <label className="label-input" for={inputSetting.label}>{inputSetting.label}:</label>
      {inputSetting.type !== "tel" && (
        <input
          className="input-message"
          type={inputSetting.type}
          placeholder={inputSetting.placeholder}
          id={inputSetting.label}
          name="message"
          onChange={(e) => {
            onMessageUpdate(e);
          }}
        />
      )}
      {inputSetting.type === "tel" && (
        <input
          className="input-message"
          type="tel"
          maxLength="10"
          placeholder={inputSetting.placeholder}
          id={inputSetting.label}
          name="message"
          onChange={(e) => {
            onMessageUpdate(e);
          }}
        />
      )}
    </div>
  );
};

export default ChatInput;
