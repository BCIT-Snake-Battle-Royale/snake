import express from "express";
import { Server } from "socket.io";
import http from "http";

// event emitter topics
const NEW_GAME = "newGame";
const JOIN_GAME = "joinGame";
const GAME_STATE = "gameState";
const END_GAME = "endGame";

// messages
const SUCCESS = "success";
const ERROR = "error";

// state keys
const SCORE = "score";
const IS_ALIVE = "isAlive";
const NUM_USERS = "numUsers";

const SERVER_PORT = 4321;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});
const gameStates = {}

io.on("connection", (socket) => {
  // every socket represents a connected client
  const id = socket.id
  console.log("A user has connected")

  /* server side helper functions */
  const newGameHandler = (username) => {
    let roomId = "testRoom"; // replace with a random room name generator
    const startingState = {roomId: roomId, isAlive: true, score: 0, username: username};

    // check if room exists already, otherwise generate another room name
    // ...
    // check if username is valid (non-empty string)
    // ...
    gameStates[roomId] = {};
    gameStates[roomId][id] = startingState;
    gameStates[roomId][NUM_USERS] = 1;
    socket.join(roomId); // this room is used for broadcasting messages
    console.log(gameStates);
    socket.emit(NEW_GAME, {msg: SUCCESS, state: startingState});
  };

  const joinGameHandler = (roomId, username) => {
    const startingState = {roomId: roomId, isAlive: true, score: 0, username: username};
    // check if roomId exists, if it exists emit message on success
    // else error message
    // ...
    // check if username is taken
    // ... 
    gameStates[roomId][id] = startingState;
    gameStates[roomId][NUM_USERS]++;
    socket.join(roomId);
    socket.emit(JOIN_GAME, {msg: SUCCESS, state: startingState});
  };

  const updateGameHandler = (roomId, userState) => {
    // TODO: double check what is being sent from client side
    // potential update state design: score and is alive
    // ... 
    if (!userState[IS_ALIVE]) {
      gameStates[roomId][NUM_USERS]--;
      gameStates[roomId][id][IS_ALIVE] = userState[IS_ALIVE];
      gameStates[roomId][id][SCORE] = userState[SCORE]; 
      if (gameStates[roomId][NUM_USERS] === 0) {
        socket.emit(END_GAME, gameStates[roomId]); 
      } else {
        socket.emit(GAME_STATE, gameStates[roomId]);
      }
    } 
  }
  

  /* listening sockets */
  // TODO: match structure with client side
  socket.on(NEW_GAME,  (data) => {
    newGameHandler(data.username)
  });

  socket.on(JOIN_GAME, (data) => {
    joinGameHandler(data.roomId, data.username);
  })

  socket.on(GAME_STATE, (data) => {
    updateGameHandler(data.roomId, data.userState)
  })

  socket.on("disconnect", () => {
    console.log("User has disconnected")
  })
});

const port = process.env.PORT || SERVER_PORT;
server.listen(port, () => {
  console.log(`Listening on *:${port}`)
})