import express from "express";
import { Server } from "socket.io";
import http from "http";

// event emitter topics
const NEW_GAME = "newGame";
const JOIN_GAME = "joinGame";
const GAME_STATE = "gameState";
const START_GAME = "startGame";
const END_GAME = "endGame";

// messages
const SUCCESS = "success";
const ERROR = "error";

// state keys
const SCORE = "score";
const IS_ALIVE = "isAlive";
const NUM_USERS = "numUsers";

const SERVER_PORT = 4321;
const ROOM_ID_LEN = 10;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

const gameStates = {}
const allClientRooms = {}

io.on("connection", (socket) => {
  // every socket represents a connected client
  const id = socket.id
  allClientRooms[id] = []
  // const clientRooms = allClientRooms[id];
  console.log("A user has connected")

  const randomizeId = (length) => {
    const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (let i = 0; i < length; i++) {
      let randomIndex = Math.floor(Math.random() * charSet.length);
      id += charSet.charAt(randomIndex);
    }
    return id;
  }

  const isValidUsername = (roomId, aUsername) => {
    let rooms = gameStates[roomId]
    for (const key in rooms) {
      if (key != NUM_USERS && aUsername === rooms[key]["username"]) {
        return false;
      }
    }
    return true;
  }

  const newGameHandler = (username) => {
    // if this socket is in other rooms and is alive
    if (allClientRooms[id].length > 0) {
      socket.emit(NEW_GAME, { status: ERROR, msg: "Connect to one game at a time.", state: [] });
    } else if (username.trim() === "") {
      socket.emit(NEW_GAME, { status: ERROR, msg: "Enter a non-empty username.", state: [] });
    } else {
      let roomId = randomizeId(ROOM_ID_LEN);
      while (roomId in gameStates) {
        roomId = randomizeId(ROOM_ID_LEN);
      }
      const startingState = { roomId: roomId, isAlive: true, score: 0, username: username };
      allClientRooms[id].push(roomId);
      gameStates[roomId] = {};
      gameStates[roomId][id] = startingState;
      gameStates[roomId][NUM_USERS] = 1;
      socket.join(roomId); // this room is used for broadcasting messages
      socket.emit(NEW_GAME, { status: SUCCESS, state: gameStates[roomId] });
    }
  };

  const joinGameHandler = (roomId, username) => {
    if (roomId in gameStates) {
      if (username.trim() === "") {
        socket.emit(JOIN_GAME, { status: ERROR, msg: "Enter non-empty username.", state: [] });
      } else if (!isValidUsername(roomId, username)) {
        socket.emit(JOIN_GAME, { status: ERROR, msg: "Sorry, this username is taken.", state: [] });
      } else {
        const startingState = { roomId: roomId, isAlive: true, score: 0, username: username };
        allClientRooms[id].push(roomId);
        gameStates[roomId][id] = startingState;
        gameStates[roomId][NUM_USERS]++;
        socket.join(roomId);
        socket.emit(JOIN_GAME, { status: SUCCESS, state: gameStates[roomId] });
        // Emit to everyone in a room that a new person has joined
        io.to(roomId).emit(JOIN_GAME, { status: SUCCESS, state: gameStates[roomId] });
      }
    } else {
      socket.emit(JOIN_GAME, { status: ERROR, msg: "Enter an existing room ID.", state: [] });
    }
  };

  const startGameHandler = (roomId) => {
    console.log("startGameHandler", gameStates[roomId]);
    io.to(roomId).emit(START_GAME, gameStates[roomId])
  }

  const endGameHandler = (roomId) => {
    console.log("endGameHandler", gameStates[roomId]);
    if (gameStates[roomId][NUM_USERS] === 0) {
      console.log("endGameHandler:\nBroadcasted to: " + roomId);
      console.log("GAME STATE", gameStates[roomId]);
      io.to(roomId).emit(END_GAME, gameStates[roomId]);
      delete gameStates[roomId];
      // iterate through allClientRooms and delete this room for all clients
      for (const [clientId, roomArray] of Object.entries(allClientRooms)) {
        let updatedRoomArray = roomArray.filter((connectedRoomId) => {
          return connectedRoomId != roomId;
        })
        allClientRooms[clientId] = updatedRoomArray;
      }
    } else {
      socket.emit(GAME_STATE, gameStates[roomId]);
    }
  }

  const updateGameHandler = (roomId, userState) => {
    if (roomId in gameStates) {
      console.log("updateGameHandler", roomId, userState);
      gameStates[roomId][id][IS_ALIVE] = userState[IS_ALIVE];
      gameStates[roomId][id][SCORE] = userState[SCORE];
      if (!userState[IS_ALIVE]) {
        gameStates[roomId][NUM_USERS]--;
      }
      // ends the game if there is only one living player
      endGameHandler(roomId);
    } else {
      socket.emit(GAME_STATE, []);
    }
  }

  const disconnectHandler = (roomId) => {
    if (gameStates[roomId] == undefined || gameStates[roomId][id] == undefined) {
      return;
    }
    gameStates[roomId][id][IS_ALIVE] = false;
    gameStates[roomId][NUM_USERS]--;
    // ends the game if there is only one living player
    endGameHandler(roomId);
    console.log("disconnectHandler", gameStates[roomId]);
  }


  /* listening sockets */
  socket.on(NEW_GAME, (data) => {
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
    const sentRoom = data.roomId;
    if (sentRoom in gameStates && gameStates[sentRoom][NUM_USERS] != 0) {
      console.log("gameState", data);
      updateGameHandler(data.roomId, data.userState)
    }
  })

  socket.on("disconnecting", () => {
    console.log("disconnecting", allClientRooms[id]);
    allClientRooms[id].forEach((room) => {
      disconnectHandler(room);
    });
    delete allClientRooms[id];
  })
});

const port = SERVER_PORT;
server.listen(port, () => {
  console.log(`Listening on *:${port}`)
})