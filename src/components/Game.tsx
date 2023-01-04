import { useEffect } from "react";
import EVENTS from "../config/events";
import { useSockets } from "../context/socket-context";

export default function Game() {
  const { socket, roomId, username } = useSockets();

  useEffect(() => {
    // log all players
    console.log("I ran!!!!!!!!!!");
    socket.on(EVENTS.SERVER.SEND_PLAYERS, (players) => {
      console.log(players);
    });
  }, []);

  return (
    <div>
      <h1>Game</h1>
      <p>Room: {roomId}</p>
      <p>Username: {username}</p>
      <p>Players: {username} TODO</p>
    </div>
  );
}
