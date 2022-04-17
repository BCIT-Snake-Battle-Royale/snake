import express from "express";
import { Server } from "socket.io";
import http from "http";
import { start } from "repl";

// event emitter topics
const NEW_GAME = "newGame";
const JOIN_GAME = "joinGame";
const GAME_STATE = "gameState";
const START_GAME = "startGame";
const END_GAME = "endGame";
const EARLY_DISCONNECT = "earlyDisconnect";

// messages
const SUCCESS = "success";
const ERROR = "error";

// state keys
const SCORE = "score";
const USERNAME = "username";
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
    socket.emit(NEW_GAME, {msg: SUCCESS, state: gameStates[roomId]});
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
    socket.emit(JOIN_GAME, {msg: SUCCESS, state: gameStates[roomId]});
    
    // Emit to everyone in a room that a new person has joined
    socket.to(roomId).emit(JOIN_GAME, {msg: SUCCESS, state: gameStates[roomId]});
  };

  const startGameHandler = (roomId) => {
    console.log(roomId);
    console.log(gameStates[roomId]);
    io.to(roomId).emit(START_GAME, gameStates[roomId])
  }

  const updateGameHandler = (roomId, userState) => {
    // TODO: double check what is being sent from client side
    // potential update state design: score and is alive
    // ... 
    console.log(roomId);
    console.log(userState);

    gameStates[roomId][id][IS_ALIVE] = userState[IS_ALIVE];
    gameStates[roomId][id][SCORE] = userState[SCORE]; 
    if (!userState[IS_ALIVE]) {
      gameStates[roomId][NUM_USERS]--;
    } 
    if (gameStates[roomId][NUM_USERS] === 0) {
      console.log("Broadcasted to: " + roomId);
      // TODO: broadcast
      io.to(roomId).emit(END_GAME, gameStates[roomId]); 
    } else {
      socket.emit(GAME_STATE, gameStates[roomId]);
    }
  }
  
  const disconnectHandler = (roomId) => {
    // iterate through the rooms the socket was present in
    // and update the state 
    console.log(roomId);
    console.log(gameStates[roomId]);
    if(gameStates[roomId] == undefined || gameStates[roomId][id] == undefined) {
      return;
    }

    gameStates[roomId][id][IS_ALIVE] = false;
    gameStates[roomId][NUM_USERS]--;
    
    // broadcast disconnected client to room
    if (gameStates[roomId][NUM_USERS] === 0) {
      // TODO: broadcast
      socket.to(roomId).emit(END_GAME, gameStates[roomId]); 
    } else {
      socket.emit(GAME_STATE, gameStates[roomId]);
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

  // start game handler and topic
  socket.on(START_GAME, (data) => {
    startGameHandler(data.roomId);
  })

  socket.on(GAME_STATE, (data) => {
    updateGameHandler(data.roomId, data.userState)
  })

  // TODO: test custom disconnect topic
  socket.on(EARLY_DISCONNECT, (data) => {
    disconnectHandler(data.roomId);
  })

  // TODO: test built in disconnect topic
  socket.on("disconnect", (data) => {
     // initial data design: {roomId: _}
    console.log("User has disconnected");
    // broadcast new state to everyone else in the room
    disconnectHandler(data.roomId);
  })
});

const port = process.env.PORT || SERVER_PORT;
server.listen(port, () => {
  console.log(`Listening on *:${port}`)
})