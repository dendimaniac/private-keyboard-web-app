import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import axios from "axios";
import queryString from "query-string";
import CryptoJS from "crypto-js";

import ChatInput from "./ChatInput/index.jsx";
import DiscreteSlider from "../components/DiscreteSlider/index.jsx";
import TakingPictureBtn from "../components/TakingPictureBtn/index.jsx";
import "./chat.css";

const FunctionURL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEVELOPMENT_FUNCTION
    : process.env.REACT_APP_PRODUCTION_FUNCTION;

const Chat = () => {
  const location = useLocation();
  const query = queryString.parse(location.search, { decode: false });
  console.log("query", query.settings);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${FunctionURL}`)
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connection.on("sendInputField", (message) => {
      console.log("ReceiveMessage", message);
    });

    connection
      .start()
      .then(() => {
        console.log("Connected!");
        if (query.uuid) {
          axios.post(`${FunctionURL}/confirmQRScan`, { uuid: query.uuid });
        }
      })
      .catch((e) => console.log("Connection failed: ", e));
  }, [query.uuid]);

  const sendMessage = async (position, message) => {
    try {
      return await axios.post(`${FunctionURL}/sendInputField`, {
        sender: query.uuid,
        targetInput: position,
        text: message,
      });
    } catch (e) {
      console.log("Sending message failed.", e);
    }
  };

  const sendRadioButtonChecked = async (
    targetRadioGroup,
    targetRadioButton
  ) => {
    try {
      return await axios.post(`${FunctionURL}/selectRadioGroup`, {
        sender: query.uuid,
        targetRadioGroup: targetRadioGroup,
        targetRadioButton: targetRadioButton,
      });
    } catch (e) {
      console.log("Sending message failed.", e);
    }
  };

  const updateTiltAngle = async (value) => {
    console.log("tilt angle", value);
    try {
      return await axios.post(`${FunctionURL}/updateTiltAngle`, {
        sender: query.uuid,
        value: value,
      });
    } catch (e) {
      console.log("Sending message failed.", e);
    }
  };

  const pressButton = async (value) => {
    try {
      return await axios.post(`${FunctionURL}/pressButton`, {
        sender: query.uuid,
        value: value,
      });
    } catch (e) {
      console.log("Sending message failed.", e);
    }
  };
  console.log("process.env.CRYPTO_KEY", process.env.REACT_APP_CRYPTO_KEY);
  const DisplayInputs = () => {
    const keyForCryptoJS = CryptoJS.enc.Base64.parse(
      process.env.REACT_APP_CRYPTO_KEY
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
    console.log("inputArray", inputArray);

    return inputArray.map((inputSetting) => {
      return (
        <ChatInput
          inputSetting={inputSetting}
          key={inputSetting.position}
          position={inputSetting.position}
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
          <h1 className="app__title">Connected!</h1>
          <DisplayInputs />
          <DiscreteSlider updateTiltAngle={updateTiltAngle} />
          <TakingPictureBtn takePicture={pressButton} />
          <button onClick={() => pressButton("sendEmail")}>
            Send Info to Email
          </button>
        </div>
      )}
    </>
  );
};

export default Chat;
