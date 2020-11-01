import React from "react";

const Message = (props) => (
  <div style={{ background: "#eee", borderRadius: "5px", padding: "0 10px" }}>
    <p>
      <strong>{props.sender}</strong> says:
    </p>
    <p>{props.text}</p>
  </div>
);

export default Message;
