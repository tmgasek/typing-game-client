import { useEffect, useRef, useState } from "react";
import { useSockets } from "../context/socket-context";
import useKeyPress from "../hooks/useKeyPress";
import ResultsView from "./ResultsView";

const currentTime = () => new Date().getTime();

export default function Game() {
  const { socket, roomId, username, usersInRoom } = useSockets();
  const [outgoingChars, setOutgoingChars] = useState("");
  const [currentChar, setCurrentChar] = useState("");
  const [incomingChars, setIncomingChars] = useState("");
  const [startTime, setStartTime] = useState<number>(0);
  const [wordCount, setWordCount] = useState(0);
  const [typedChars, setTypedChars] = useState("");
  const wpmRef = useRef(0);
  const accuracyRef = useRef(0);
  const charIndexRef = useRef(0);
  const [playerIndexes, setPlayerIndexes] = useState<any[]>([]);
  const [allWords, setAllWords] = useState<string>("");
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

  // set up socket listeners on mount
  useEffect(() => {
    socket.on("WORDS", (words: string) => {
      if (!words) return;
      setCurrentChar(words.charAt(0));
      setIncomingChars(words.slice(1));
      setAllWords(words);
    });

    socket.on("GAME_OVER_SERVER", () => {
      // send stats to server
      socket.emit("SENDING_STATS", {
        roomId,
        username,
        wpm: wpmRef.current,
        accuracy: accuracyRef.current,
      });
      setStatus("finished");
    });

    socket.on("SENDING_STATS_SERVER", ({ users }: any) => {
      setStats(users);
    });

    socket.on("UPDATE_INDEX_SERVER", ({ username, charIndex, color }) => {
      setPlayerIndexes((prev) => {
        const existingIndex = prev.findIndex((p) => p.username === username);
        if (existingIndex !== -1) {
          prev[existingIndex].charIndex = charIndex;
          return [...prev];
        }
        return [...prev, { username, charIndex, color }];
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useKeyPress((key: string) => {
    if (status !== "ready") return;

    if (!startTime) {
      setStartTime(currentTime());
    }

    let updatedOutgoingChars = outgoingChars;
    let updatedIncomingChars = incomingChars;

    // if key press is correct, we send update to server with current index
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

      charIndexRef.current += 1;
      // send update to server with current index
      socket.emit("UPDATE_INDEX", {
        roomId,
        username,
        charIndex: charIndexRef.current,
      });
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

  if (status === "finished") {
    return <ResultsView stats={stats} />;
  }

  return (
    <div>
      {status === "waiting" && "Waiting for game to start..."}
      {status === "ready" && "Game started!"}
      <h1>Game</h1>
      <p>Room: {roomId}</p>
      <div className="">
        <div className="flex gap-4">
          {playerIndexes.map((player) => (
            <div
              style={{
                backgroundColor: usersInRoom.find(
                  (p) => p.username === player.username
                )?.color,
              }}
              key={player.username}
            >
              <p>{player.username}</p>
              <p>{player.charIndex}</p>
            </div>
          ))}
        </div>
        <div className="relative">
          <p className="py-10 font-mono text-3xl leading-loose">
            <span className="text-gray-400">{outgoingChars}</span>
            <span
              style={{
                backgroundColor: usersInRoom.find(
                  (u) => u.username === username
                )?.color,
              }}
            >
              {currentChar}
            </span>
            <span>{incomingChars}</span>
          </p>
          {playerIndexes.map((player) => (
            <div key={player.username}>
              <p className="absolute left-0 top-0 -z-10 py-10 font-mono text-3xl leading-loose text-transparent">
                <span>
                  {allWords.split("").map((char, index) => {
                    return (
                      <span key={index} className="">
                        <span
                          className="relative"
                          style={{
                            backgroundColor:
                              player.charIndex === index && player.color,
                          }}
                        >
                          {index === player.charIndex &&
                            player.username !== username && (
                              <span
                                style={{
                                  color: player.color,
                                  borderColor: player.color,
                                  border: "1px solid",
                                }}
                                className="absolute -top-6 left-0 z-50 px-1 text-sm"
                              >
                                {player.username}
                              </span>
                            )}
                          {char}
                        </span>
                      </span>
                    );
                  })}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
