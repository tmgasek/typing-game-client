const EVENTS = {
  connection: "connection",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
    JOIN_ROOM: "JOIN_ROOM",
    START_GAME: "START_GAME",
    GET_PLAYERS_IN_ROOM: "GET_PLAYERS_IN_ROOM",
  },
  SERVER: {
    ROOMS: "ROOMS",
    JOINED_ROOM: "JOINED_ROOM",
    ROOM_MESSAGE: "ROOM_MESSAGE",
    GAME_STARTED: "GAME_STARTED",
    SEND_PLAYERS_IN_ROOM: "SEND_PLAYERS_IN_ROOM",
    SEND_ALL_USERS: "SEND_ALL_USERS",
  },
};

export type Events =
  | "client:create_room"
  | "client:send_room_message"
  | "client:join_room"
  | "client:start_game"
  | "client:get_players_in_room"
  | "server:rooms"
  | "server:joined_room"
  | "server:room_message"
  | "server:game_started"
  | "server:send_players_in_room"
  | "server:send_all_users";

export default EVENTS;
