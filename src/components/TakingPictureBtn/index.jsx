import React, { useState } from "react";

import "./takingPictureBtn.css"

export default function TakingPictureBtn({ takePicture }) {
  const [cameraStatus, setCameraStatus] = useState("off");
  const [isCapture, setIsCapture] = useState(false);

  const handleTakePictureBtn = (status) => {
    if (status === "on") {
      takePicture(status);
      setCameraStatus(status);
    }
    if (status === "capture") {
      takePicture(status);
      setIsCapture(true);
    }
    if (status === "confirm") {
      takePicture(status);
      setIsCapture(false);
      setCameraStatus("off");
    }
    if (status === "retake") {
      takePicture(status);
      setCameraStatus("on");
      setIsCapture(false);
    }
    if (status === "cancel") {
      takePicture(status);
      setIsCapture(false);
      setCameraStatus("off");
    }
  };
  return (
    <div className="button__container">
      {cameraStatus === "off" && (
        <button onClick={() => handleTakePictureBtn("on")}>
          Take a picture
        </button>
      )}
      {cameraStatus === "on" && (
        <>
          {!isCapture && (
            <button className="button__capture" onClick={() => handleTakePictureBtn("capture")}>
              Capture
            </button>
          )}
          {isCapture && (
            <>
              <button className="button__confirm" onClick={() => handleTakePictureBtn("confirm")}>
                Confirm
              </button>
              <button className="button__retake" onClick={() => handleTakePictureBtn("retake")}>
                Retake
              </button>
            </>
          )}
          <button className="button__cancel" onClick={() => handleTakePictureBtn("cancel")}>Cancel</button>
        </>
      )}
    </div>
  );
}
