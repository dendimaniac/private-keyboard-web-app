import React from "react";

import "./ChatInput.css";

const ChatInput = ({
  inputSetting,
  sendMessage,
  sendRadioButtonChecked,
  position,
}) => {
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

  const onRadioButtonUpdate = (index) => {
    sendRadioButtonChecked(position, index);
  };

  console.log("inputSetting", inputSetting);
  return (
    <div className="form-input">
        <label className="label-input" htmlFor={inputSetting.label}>
          {inputSetting.label}:
        </label>
        {inputSetting.type === "text" && (
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
        {inputSetting.type === "email" && (
          <input
            className="input-message"
            type={inputSetting.type}
            placeholder={inputSetting.placeholder}
            id={inputSetting.label}
            pattern={"[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$"}
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
        {inputSetting.type === "radio" && (
          <>
            {inputSetting.radioButtons.map((setting, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={setting.label}
                  name={inputSetting.group}
                  defaultChecked={setting.isChecked}
                  value={setting.label}
                  onChange={() => onRadioButtonUpdate(index)}
                />
                <label htmlFor={setting.label}>{setting.label}</label>
              </div>
            ))}
          </>
        )}
    </div>
  );
};

export default ChatInput;
