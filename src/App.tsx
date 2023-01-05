import { useEffect, useRef, useState } from "react";
import { useSockets } from "./context/socket-context";
import Rooms from "./components/Rooms";
import Messages from "./components/Messages";
import Game from "./components/Game";

function App() {
  const { socket, username, setUsername, gameStarted, connectedUsers } =
    useSockets();
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // const storedUsername = localStorage.getItem("username");
    // if (storedUsername) {
    //   setUsername(storedUsername);
    // }
  }, []);

  const handleSetUsername = () => {
    const username = usernameRef.current?.value;

    if (!username) return;

    setUsername(username);
    localStorage.setItem("username", username);
    socket.auth = { username };
    socket.connect();
  };

  return (
    <div className="grid grid-cols-4 py-8 ">
      <div className="col-span-1 w-fit border border-black mx-4 p-2">
        <h2>Current users</h2>
        <ul>
          {connectedUsers.length === 0 && (
            <li className="underline">Enter username to view other users</li>
          )}
          {connectedUsers.map((user: any) => (
            <li
              className={`${user.username === username && "bg-gray-200"}`}
              key={user.userID}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>
      {!username && (
        <div>
          <input
            className="border border-gray-500"
            type="text"
            ref={usernameRef}
          />
          <button onClick={handleSetUsername}>Set Username</button>
        </div>
      )}
      {gameStarted ? (
        <div className="col-span-3">
          <Game />
        </div>
      ) : (
        <div>
          <Rooms />
          <Messages />
        </div>
      )}
    </div>
  );
}

export default App;
