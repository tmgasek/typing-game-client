import { useRef, useState } from "react";
import EVENTS from "../config/events";
import { useSockets } from "../context/socket-context";

const Rooms = (props: {}) => {
  const { socket, roomId, rooms } = useSockets();
  const newRoomRef = useRef<HTMLInputElement>(null);

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
    console.log("joining room", rooms[key]);
    if (key === roomId) return;

    socket.emit(EVENTS.CLIENT.JOIN_ROOM, { roomId: key });
  };

  return (
    <nav>
      <div>
        <input
          className="border border-gray-500"
          ref={newRoomRef}
          type="text"
        />
        <button onClick={handleCreateRoom}>Create Room</button>
      </div>
      <div>
        <h1 className="text-2xl underline">Rooms</h1>
        {roomId && <p>Current Room: {rooms[roomId].name}</p>}
        <div className="flex gap-2">
          {Object.keys(rooms).map((key) => (
            <button
              className={`border border-black ${
                key !== roomId && "hover:bg-gray-200"
              }`}
              onClick={() => handleJoinRoom(key)}
              disabled={key === roomId}
              key={key}
            >
              {rooms[key as keyof typeof rooms].name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Rooms;
