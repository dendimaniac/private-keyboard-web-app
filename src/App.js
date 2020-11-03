import React from "react";
import './App.css';
import Chat from "./Chat/Chat";

const App = () => {
  console.log(process.env.REACT_APP_PRODUCTION_FUNCTION);

  return (
    <div className="App" >
      <Chat />
    </div>
  );
}

export default App;
