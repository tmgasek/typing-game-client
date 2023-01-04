import { createContext, useContext, useState } from "react";
import io, { Socket } from "socket.io-client";
import { SOCKET_URL } from "../config";
import EVENTS from "../config/events";

interface Context {
  socket: Socket;
  username?: string;
  setUsername: (username: string) => void;
  roomId?: string;
  rooms: Rooms;
  messages?: Messages;
  setMessages: Function;
  gameStarted: boolean;
  setGameStarted: (gameStarted: boolean) => void;
}
const socket = io(SOCKET_URL, { autoConnect: false });

const SocketContext = createContext<Context>({
  socket,
  setUsername: () => {},
  rooms: {},
  setMessages: () => {},
  messages: [],
  gameStarted: false,
  setGameStarted: () => {},
});

type Rooms = {
  [key: string]: {
    name: string;
  };
};

type Messages = {
  message: string;
  time: string;
  username: string;
}[];

export default function SocketsProvider(props: any) {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [rooms, setRooms] = useState<Rooms>({});
  const [messages, setMessages] = useState<Messages>([]);
  const [gameStarted, setGameStarted] = useState(false);

  socket.on(EVENTS.SERVER.ROOMS, (value) => {
    setRooms(value);
  });

  socket.on(EVENTS.SERVER.JOINED_ROOM, (value) => {
    setRoomId(value);
    setMessages([]);
  });

  socket.on(EVENTS.SERVER.ROOM_MESSAGE, ({ message, username, time }) => {
    setMessages([
      ...messages,
      {
        message,
        username,
        time,
      },
    ]);
  });

  socket.on(EVENTS.SERVER.GAME_STARTED, () => {
    console.log("STARTING GAME");
    setGameStarted(true);
  });

  socket.on(EVENTS.SERVER.SEND_PLAYERS, (players) => {
    console.log("logging players", players);
  });

  return (
    <SocketContext.Provider
      value={{
        socket,
        username,
        setUsername,
        rooms,
        roomId,
        messages,
        setMessages,
        gameStarted,
        setGameStarted,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
}

export const useSockets = () => useContext(SocketContext);
