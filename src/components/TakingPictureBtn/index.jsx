import React, { useState } from "react";

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
    <div>
      {cameraStatus === "off" && (
        <button onClick={() => handleTakePictureBtn("on")}>
          Take a picture
        </button>
      )}
      {cameraStatus === "on" && (
        <>
          {!isCapture && (
            <button onClick={() => handleTakePictureBtn("capture")}>
              Capture
            </button>
          )}
          {isCapture && (
            <>
              <button onClick={() => handleTakePictureBtn("confirm")}>
                Confirm
              </button>
              <button onClick={() => handleTakePictureBtn("retake")}>
                Retake
              </button>
            </>
          )}
          <button onClick={() => handleTakePictureBtn("cancel")}>Cancel</button>
        </>
      )}
    </div>
  );
}
