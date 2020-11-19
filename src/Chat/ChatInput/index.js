import React, {useEffect} from "react";
import "./ChatInput.css";
import {BlobServiceClient} from '@azure/storage-blob';

const ChatInput = ({
  inputSetting,
  sendMessage,
  sendRadioButtonChecked,
  position,
}) => {
  let message = "";
  let timer = null;
  let files = []
  useEffect(()=>{
    listFiles()
  },[])
  // Update <placeholder> with your Blob service SAS URL string
  const blobSasUrl = "https://privatekeyboard.blob.core.windows.net/?sv=2019-12-12&ss=bfqt&srt=sco&sp=rwdlacupx&se=2020-11-18T21:52:31Z&st=2020-11-18T13:52:31Z&spr=https&sig=hSh1%2FU2W75LoI%2B5QVox6RXC%2F6hpMcY%2FNODjzRtKUus0%3D"
  // Create a new BlobServiceClient
  const blobServiceClient = new BlobServiceClient(blobSasUrl);

  // Create a unique name for the container by 
  // appending the current time to the file name
  const containerName = "containertest";

  // Get a container client from the BlobServiceClient
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const listFiles = async () => {
    try {
      let iter = containerClient.listBlobsFlat();
      let blobItem = await iter.next();
      const blockBlobClient = containerClient.getBlockBlobClient(blobItem.name);
      console.log("dang test: ", blockBlobClient);
      // files.push(blobItem);
      while (!blobItem.done) {
        blobItem = await iter.next();
        // console.log(blobItem.name);
        // files.push(blobItem);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const uploadFiles = async (files) => {
    try {
      const promises = [];
      for (const file of files) {
        const blockBlobClient = containerClient.getBlockBlobClient(file.name);
        promises.push(blockBlobClient.uploadBrowserData(file));
      }
      await Promise.all(promises);
    }
    catch (error) {
      console.log("Error: ", error);
    }
  }


  const onMessageUpdate = (e) => {
    if (e.target.type === "file") {
      console.log("That's right yess sirrr");
      // const json = e.target.files[0];
      // message = {
      //   type: "file",
      //   file: json
      // }
    } else {
      message = e.target.value;
    }
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

  return (
    <div className="form-input">
      <>
        <label className="label-input" htmlFor={inputSetting.label}>
          {inputSetting.label}:
        </label>
        {position === 0 && (
          <input
            className="input-message"
            type="file"
            name="message"
            multiple
            onClick={() => {
              listFiles();
            }}
            onChange={(e) => {
              // onMessageUpdate(e);
              uploadFiles(e.target.files);
              console.log("Onchange");

            }}
          />
        )}
        {inputSetting.type === "text" && position !== 0 && (
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
      </>
    </div>
  );
};

export default ChatInput;
