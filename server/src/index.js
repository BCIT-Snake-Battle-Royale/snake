import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});
const gameStates = {}
// add nickname to state
const startingState = {isAlive: true, score: 0};

io.on("connection", (socket) => {
  // every socket represents a connected client
  const id = socket.id
  console.log("A user has connected")

  /* server side helper functions */
  const newGameHandler = () => {
    let roomId = "testRoom"; // replace with a random room name generator

    // check if room exists already, otherwise generate another room name
    // ...

    gameStates[roomId] = {};
    gameStates[roomId][id] = startingState;
    gameStates[roomId]["numUsers"] = 1;
    socket.join(roomId); // this room is used for broadcasting messages
    console.log(gameStates);
    socket.emit("newGame", roomId);
  };

  const joinGameHandler = (roomId) => {
    // check if roomId exists, if it exists emit message on success
    // else error message
    // ...
    gameStates[roomId][id] = startingState;
    gameStates[roomId][numUsers]++;
    socket.join(roomId);
    socket.emit("joinGame", {msg: "success"});
  };

  // only the host can emit start game on client side
  const startGameHandler = (roomId) => {
    socket.emit("gameState", gameStates[roomId]);
  };

  const updateGameHandler = (roomId, userState) => {
    if (!userState.isAlive) {
      gameStates[roomId][numUsers]--;
      if (gameStates[roomId][numUsers] === 0) {
        socket.emit("gameOver", gameStates[roomId]); 
      } else {
        socket.emit("gameState", gameStates[roomId]);
      }
    } 
  }
  

  /* listening sockets */
  socket.on("newGame", newGameHandler);

  socket.on("joinGame", (roomId) => {
    joinGameHandler(roomId);
  })

  socket.on("disconnect", () => {
    console.log("User has disconnected")
  })
});

const port = process.env.PORT || 4321;
server.listen(port, () => {
  console.log(`Listening on *:${port}`)
})