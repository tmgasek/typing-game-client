import { useState } from "react";
import io from "socket.io-client";

function App() {
  const [count, setCount] = useState(0);

  const socket = io("http://localhost:3001", { autoConnect: false });

  // for debugging
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  return (
    <div className="">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </div>
  );
}

export default App;
