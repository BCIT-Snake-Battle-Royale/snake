import express from "express";
import { Server } from "socket.io";
import http from "http";

// event emitter topics
const NEW_GAME = "newGame";
const JOIN_GAME = "joinGame";
const GAME_STATE = "gameState";
const END_GAME = "endGame";

const SUCCESS = "success";
const ERROR = "error";

const SERVER_PORT = 4321;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});
const gameStates = {}
// add nickname to state
// [username: {isAlive: true, score: 0}]

io.on("connection", (socket) => {
  // every socket represents a connected client
  const id = socket.id
  console.log("A user has connected")

  /* server side helper functions */
  const newGameHandler = (username) => {
    let roomId = "testRoom"; // replace with a random room name generator
    const startingState = {isAlive: true, score: 0, username: username};

    // check if room exists already, otherwise generate another room name
    // ...

    gameStates[roomId] = {};
    gameStates[roomId][id] = startingState;
    gameStates[roomId]["numUsers"] = 1;
    socket.join(roomId); // this room is used for broadcasting messages
    console.log(gameStates);
    socket.emit(NEW_GAME, roomId);
  };

  const joinGameHandler = (roomId) => {
    // check if roomId exists, if it exists emit message on success
    // else error message
    // ...
    // check if username is taken
    gameStates[roomId][id] = startingState;
    gameStates[roomId][numUsers]++;
    socket.join(roomId);
    // add initial state and nickname
    socket.emit(JOIN_GAME, {msg: SUCCESS});
  };

  // only the host can emit start game on client side
  const startGameHandler = (roomId) => {
    socket.emit(GAME_STATE, gameStates[roomId]);
  };

  const updateGameHandler = (roomId, userState) => {
    if (!userState.isAlive) {
      gameStates[roomId][numUsers]--;
      if (gameStates[roomId][numUsers] === 0) {
        socket.emit(END_GAME, gameStates[roomId]); 
      } else {
        socket.emit(GAME_STATE, gameStates[roomId]);
      }
    } 
  }
  

  /* listening sockets */
  socket.on(NEW_GAME,  () => {newGameHandler(username)});

  socket.on(JOIN_GAME, (roomId) => {
    joinGameHandler(roomId);
  })

  socket.on("disconnect", () => {
    console.log("User has disconnected")
  })
});

const port = process.env.PORT || SERVER_PORT;
server.listen(port, () => {
  console.log(`Listening on *:${port}`)
})