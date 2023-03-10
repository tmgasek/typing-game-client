import { useEffect, useRef } from "react";
import EVENTS from "../config/events";
import { useSockets } from "../context/socket-context";

const Rooms = () => {
  const { socket, roomId, rooms, usersInRoom } = useSockets();
  const newRoomRef = useRef<HTMLInputElement>(null);

  console.log({ usersInRoom });

  const handleCreateRoom = () => {
    // get room name
    const roomName = newRoomRef.current?.value;
    if (!roomName) return;
    // emit room created event
    socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomName });
    // set room name to empty
    newRoomRef.current.value = "";
  };

  const handleJoinRoom = (key: string) => {
    if (key === roomId) return;

    socket.emit(EVENTS.CLIENT.JOIN_ROOM, { roomId: key });
  };

  useEffect(() => {
    if (!roomId) return;
    socket.emit(EVENTS.CLIENT.GET_PLAYERS_IN_ROOM, { roomId });
  }, [roomId]);

  return (
    <nav className="">
      <div>
        <input
          className="border border-gray-500"
          ref={newRoomRef}
          type="text"
        />
        <button
          className="mt-1 mb-4 border border-black px-2 hover:bg-gray-200"
          onClick={handleCreateRoom}
        >
          Create Room
        </button>
      </div>
      <div>
        <h1 className="text-2xl underline">Rooms</h1>
        {roomId && <p>Current Room: {rooms[roomId].name}</p>}
        <div className="flex gap-2 py-4">
          {Object.keys(rooms).map((key) => (
            <button
              className={`border border-black px-3 py-1 shadow-sm shadow-emerald-500 ${
                key !== roomId && "hover:bg-emerald-100 "
              } ${key === roomId && "bg-emerald-300"}`}
              onClick={() => handleJoinRoom(key)}
              disabled={key === roomId}
              key={key}
            >
              {rooms[key as keyof typeof rooms].name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <ul>
          {usersInRoom.length === 0 && (
            <li className="underline">No players in room</li>
          )}
          {usersInRoom.map((user: any) => (
            <li style={{ backgroundColor: user.color }} key={user.userID}>
              {user.username}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Rooms;
