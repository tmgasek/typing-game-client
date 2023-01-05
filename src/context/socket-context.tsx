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
  connectedUsers: string[];
  usersInRoom: any[];
}
const socket = io(SOCKET_URL, { autoConnect: false });

const SocketContext = createContext<Context>({
  socket,
  setUsername: () => false,
  rooms: {},
  setMessages: () => false,
  messages: [],
  gameStarted: false,
  setGameStarted: () => false,
  connectedUsers: [],
  usersInRoom: [],
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
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [usersInRoom, setUsersInRoom] = useState<string[]>([]);

  socket.on(EVENTS.SERVER.SEND_ALL_USERS, (users: any) => {
    setConnectedUsers(users);
  });

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
    setGameStarted(true);
  });

  socket.on(EVENTS.SERVER.SEND_PLAYERS_IN_ROOM, ({ users }) => {
    setUsersInRoom(users);
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
        connectedUsers,
        usersInRoom,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
}

export const useSockets = () => useContext(SocketContext);
