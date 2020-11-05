import React, { useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import axios from "axios";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import * as CryptoJS from "crypto-js";
import ChatInput from "./ChatInput";

const FunctionURL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEVELOPMENT_FUNCTION
    : process.env.REACT_APP_PRODUCTION_FUNCTION;

const Chat = () => {
  const location = useLocation();
  const query = queryString.parse(location.search);
  console.log("query", query);

  useEffect(() => {
    // Console result of decrypting
    //For testing decrypting text

    //Get key
    const base64EncodedKeyFromJava =
      "UFJJVkFURUtFWUJPQVJEUw=="; /* copied from output of Java program  */
    const keyForCryptoJS = CryptoJS.enc.Base64.parse(base64EncodedKeyFromJava);

    const encryptedText =
      "x94QNnworCdhvE5+XLrQliup+F3Cu3iT8As3ja2tlFVhN3/TZHvxU6WT2qfL6wVAPOnV5DQ3RX3lDjen4LFzMptM3VHFaEjXByD1guL3qlJIG7Wnb1CDZvq4VlPtpRpftnlizs5lc/cGA/AH3M5XrCnD/g7z30I896Lq9j6XHoysFMNZgb9I9/ei4+MYrHbWS4WJwoHbhQM0aHdKif7Fq+VGmt97r0GeXPPJvfeihRA=";
    const decodeBase64 = CryptoJS.enc.Base64.parse(encryptedText);

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
    
    console.log("Result: ", decryptedText);
    console.log(JSON.parse(decryptedText));

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
    let inputArray = Array.from(Array(Number(query.amount)));
    inputArray = inputArray.map((el) => {
      return { label: "First name", type: "text" };
    });
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
