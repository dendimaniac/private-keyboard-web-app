import React from "react";
import { useLocation } from "react-router-dom";

import Chat from "./Chat";

function App() {
  const location = useLocation();
  console.log(process.env.REACT_APP_PRODUCTION_FUNCTION);
  console.log(location.search);

  return (
    <div style={{ margin: "0 30%" }}>
      <Chat />
    </div>
  );
}

export default App;
