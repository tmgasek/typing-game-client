import { useEffect, useRef, useState } from "react";
import { useSockets } from "../context/socket-context";
import useKeyPress from "../hooks/useKeyPress";

const currentTime = () => new Date().getTime();

export default function Game() {
  const { socket, roomId, username, usersInRoom } = useSockets();
  const otherPlayers = usersInRoom.filter((user) => user.username !== username);
  const [initialWords, setInitialWords] = useState("");
  const [outgoingChars, setOutgoingChars] = useState("");
  const [currentChar, setCurrentChar] = useState("");
  const [incomingChars, setIncomingChars] = useState("");
  const [startTime, setStartTime] = useState<number>(0);
  const [wordCount, setWordCount] = useState(0);
  const [typedChars, setTypedChars] = useState("");
  const wpmRef = useRef(0);
  const accuracyRef = useRef(0);

  const [status, setStatus] = useState<"waiting" | "ready" | "finished">(
    "waiting"
  );

  const [stats, setStats] = useState<any>([]);

  // create a 3 second countdown, and then emit an event to get words
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("ready");
      socket.emit("GET_WORDS", { roomId });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log("I RANs");
    socket.on("WORDS", (words: string) => {
      console.log({ words });
      if (!words) return;
      setInitialWords(words);
      setCurrentChar(words.charAt(0));
      setIncomingChars(words.slice(1));
    });

    socket.on("GAME_OVER_SERVER", () => {
      console.log("GAME_OVER_SERVER from server");
      // send stats to server
      socket.emit("SENDING_STATS", {
        roomId,
        username,
        wpm: wpmRef.current,
        accuracy: accuracyRef.current,
      });
    });

    socket.on("SENDING_STATS_SERVER", ({ users }: any) => {
      setStats(users);
    });
  }, []);

  console.table(stats);

  useKeyPress((key: string) => {
    if (status !== "ready") return;

    if (!startTime) {
      setStartTime(currentTime());
    }

    let updatedOutgoingChars = outgoingChars;
    let updatedIncomingChars = incomingChars;

    if (key === currentChar) {
      updatedOutgoingChars += currentChar;
      setOutgoingChars(updatedOutgoingChars);

      setCurrentChar(incomingChars.charAt(0));

      updatedIncomingChars = incomingChars.slice(1);
      setIncomingChars(updatedIncomingChars);

      if (incomingChars.charAt(0) === " ") {
        setWordCount(wordCount + 1);
        const durationInMinutes = (currentTime() - startTime) / 60000.0;
        const wpm = Number(((wordCount + 1) / durationInMinutes).toFixed(2));
        wpmRef.current = wpm;
      }
    }

    const updatedTypedChars = typedChars + key;
    setTypedChars(updatedTypedChars);
    const accuracy = Number(
      ((updatedOutgoingChars.length * 100) / updatedTypedChars.length).toFixed(
        2
      )
    );
    accuracyRef.current = accuracy;

    // emit an event when you've finished typing to signal game over
    if (incomingChars.length === 0) {
      socket.emit("GAME_OVER", { roomId });
      setStatus("finished");
    }
  });

  return (
    <div>
      {status === "waiting" && "Waiting for game to start..."}
      {status === "finished" && "Game over!"}
      {status === "ready" && "Game started!"}
      <h1>Game</h1>
      <p>Room: {roomId}</p>
      <p>Username: {username}</p>
      <div>
        <h2>Other players</h2>
        <ul>
          {otherPlayers.length === 0 && (
            <li className="underline">No other players in room</li>
          )}
          {otherPlayers.map((user: any) => (
            <li key={user.userID}>{user.username}</li>
          ))}
        </ul>
        <h3>WPM: {wpmRef.current}</h3>
      </div>
      <div className="">
        <h3>Accuracy: {accuracyRef.current}</h3>
        <p className="">
          <span className="text-gray-400">{outgoingChars}</span>
          <span className="bg-teal-200">{currentChar}</span>
          <span>{incomingChars}</span>
        </p>
      </div>
    </div>
  );
}
