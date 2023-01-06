import { useEffect, useRef } from "react";
import Game from "./components/Game";
import Messages from "./components/Messages";
import Rooms from "./components/Rooms";
import { useSockets } from "./context/socket-context";

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

  if (!username) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-4xl">Enter Username</h1>
        <form className="flex flex-col items-center justify-center">
          <input
            name="username"
            className="border border-gray-500"
            ref={usernameRef}
            type="text"
          />
          <button
            type="submit"
            className="mt-1 border border-black px-2 hover:bg-gray-200"
            onClick={handleSetUsername}
          >
            Set Username
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 justify-center py-8">
      {!gameStarted && (
        <div className="col-span-1 mx-4 w-fit border border-black p-2">
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
      )}
      {gameStarted ? (
        <div className="col-span-4">
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
