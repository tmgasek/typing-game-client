import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import SocketsProvider from "./context/socket-context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <SocketsProvider>
    <App />
  </SocketsProvider>
  // </React.StrictMode>,
);
