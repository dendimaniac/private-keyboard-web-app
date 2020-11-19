import React, {useEffect} from "react";
import {HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import axios from "axios";
import {useLocation} from "react-router-dom";
import queryString from "query-string";
import CryptoJS from "crypto-js";
import ChatInput from "./ChatInput";

const FunctionURL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEVELOPMENT_FUNCTION
    : process.env.REACT_APP_PRODUCTION_FUNCTION;

const Chat = () => {
  const location = useLocation();
  const query = queryString.parse(location.search, {decode: false});

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${FunctionURL}`)
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connection.on("newMessage", (message) => {
      console.log("ReceiveMessage", message);
    });

    connection
      .start()
      .then(() => {
        console.log("Connected!");
        if (query.uuid) {
          axios.post(`${FunctionURL}/confirmqrscan`, {uuid: query.uuid});
        }
      })
      .catch((e) => console.log("Connection failed: ", e));
  }, [query.uuid]);

  const sendMessage = async (position, message) => {
    let formData = {};

    try {
      if (message.type === 'file') {
        formData = new FormData();
        formData.append('file', message.file);
        const res = await axios.post(`${FunctionURL}/messages`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        });
        console.log(res);
        return res;
      } else {
        const res = await axios.post(`${FunctionURL}/messages`, {
          sender: query.uuid,
          targetInput: position,
          text: message,
        });
        console.log(res);
        return res;
      }
    } catch (e) {
      console.log("Sending message failed.", e);
    }
  };

  const sendRadioButtonChecked = async (
    targetRadioGroup,
    targetRadioButton
  ) => {
    try {
      return await axios.post(`${FunctionURL}/radiogroup`, {
        sender: query.uuid,
        targetRadioGroup: targetRadioGroup,
        targetRadioButton: targetRadioButton,
      });
    } catch (e) {
      console.log("Sending message failed.", e);
    }
  };

  const DisplayInputs = () => {
    const keyForCryptoJS = CryptoJS.enc.Base64.parse(
      "UFJJVkFURUtFWUJPQVJEUw=="
    );
    const decodeBase64 = CryptoJS.enc.Base64.parse(query.settings);

    const decryptedData = CryptoJS.AES.decrypt(
      {
        ciphertext: decodeBase64,
      },
      keyForCryptoJS,
      {
        mode: CryptoJS.mode.ECB,
      }
    );

    const decryptedText = decryptedData.toString(CryptoJS.enc.Utf8);
    const inputArray = JSON.parse(decryptedText);

    return inputArray.map((inputSetting, index) => {
      return (
        <ChatInput
          inputSetting={inputSetting}
          key={index}
          position={index}
          sendMessage={sendMessage}
          sendRadioButtonChecked={sendRadioButtonChecked}
        />
      );
    });
  };

  const hasEnoughRequiredQuery = query.settings && query.uuid;

  return (
    <>
      {hasEnoughRequiredQuery && (
        <div>
          <h1>Connected!</h1>
          <DisplayInputs />
        </div>
      )}
    </>
  );
};

export default Chat;
