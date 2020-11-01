import React from "react";

import Chat from "./Chat";

function App() {
  console.log(process.env.REACT_APP_PRODUCTION_FUNCTION);

  return (
    <div style={{ margin: "0 30%" }}>
      <Chat />
    </div>
  );
}

export default App;
