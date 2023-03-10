import { useRef } from "react";
import EVENTS from "../config/events";
import { useSockets } from "../context/socket-context";

const Messages = () => {
  const { socket, messages, roomId, username, setMessages, setGameStarted } =
    useSockets();
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    const message = messageRef.current?.value;
    if (!message) return;

    socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, { roomId, message, username });

    // when we send a new message, we'll be broadcasting it to everyone else.
    // broadcast doesnt emit to current client. Can emit new event jsut for them
    // or we can just add it to the messages array
    const date = new Date();
    setMessages([
      ...(messages as any),
      {
        username: "You",
        message,
        time: `${date.getHours()}:${date.getMinutes()}`,
      },
    ]);
    messageRef.current.value = "";
  };

  const handleStartGame = () => {
    socket.emit(EVENTS.CLIENT.START_GAME, { roomId, username });
  };

  if (!roomId) {
    return <div>Join a room to see messages</div>;
  }

  if (!messages) {
    return <div>No messages</div>;
  }

  return (
    <div>
      <h1 className="pt-4 text-2xl underline">Messages</h1>
      {messages.map((message, index) => (
        <p key={index}>
          {message.username}:{message.message}
        </p>
      ))}

      <div className="w-fit border border-black p-4">
        <textarea rows={1} placeholder="message" ref={messageRef} />
        <button className="border border-black p-4" onClick={handleSendMessage}>
          Send
        </button>
      </div>
      <button
        onClick={handleStartGame}
        className="border-red border p-4 text-xl"
      >
        Start game
      </button>
    </div>
  );
};

export default Messages;
