export * from "./multiplayer.js";
import * as game from "lib-game-wasm";

const DEFAULT_NETWORK_TICKRATE = 500;

let tickConfig;
let tickTimeout;
let curConfig;
let snakegame;
let current_dir = 0;
let default_tickrate = 100;

// Event emitter for sending data to the server twice a second
// Uses the snakeGame config method to get the length, width and height of the snake
// TODO: Add the death flag from the snake config once available
// export function updateStateHandler(snakeGame, socket, roomId, username) {
export function updateStateHandler(socket, roomId, username) {
  // const config = snakeGame;
  // Game state should have the isAlive boolean retrieved from the snakegame config
  setInterval(() => {
    const gs = getGameState(username);
    console.log("Game state", gs);
    if (curConfig && curConfig?.snake_is_alive === false) {
      endGame();
    } else {
      socket.emit("gameState", { roomId: roomId, userState: gs });
    }
  }, DEFAULT_NETWORK_TICKRATE);
}

// Socket emitter Function for emitting to the server that a client has joined a lobby
export function joinGameHandler(socket, roomId, username) {
  socket.emit("joinGame", { roomId: roomId, username: username });
}

// Socket functions for the lobby hosts
// TODO: Event emitter for when the host presses "new game" and updates the front end with the waiting room UI
export function newGameHandler(socket, username) {
  socket.emit("newGame", { username: username });
}

// Temporary function for ending the snake game
export function endGameHandler(socket, roomId, username) {
  // TODO: Clear timeout for game loop 
  endGame();

  socket.emit("gameState", {
    roomId: roomId,
    userState: { isAlive: false, score: curConfig?.snake_score, username: username },
  });
}

// TODO: Event emitter for when the host presses "start game"
export function startGameHandler(socket, roomId) {
  socket.emit("startGame", { roomId: roomId });
  console.log("start game");
}

export function getGameState(username) {
  const gs = {
    isAlive: curConfig?.snake_is_alive,
    username,
    score: curConfig?.snake_score,
  };
  return gs;
}

let checkKey = (e) => {
  e = e || window.event;

  if (e.keyCode == "38" || e.keyCode == "87") {
    // up
    current_dir = 0;
  } else if (e.keyCode == "40" || e.keyCode == "83") {
    // down
    current_dir = 180;
  } else if (e.keyCode == "37" || e.keyCode == "65") {
    // left
    current_dir = 270;
  } else if (e.keyCode == "39" || e.keyCode == "68") {
    // right
    current_dir = 90;
  }
}

var tick = function () {
  tickConfig = {
    direction_vector: current_dir,
  };
  curConfig = snakegame.tick(tickConfig);
  // tickTimeout = setTimeout(tick, curConfig.tickrate);
  // console.log(curConfig)

  if (curConfig?.snake_is_alive === true) {
    tickTimeout = setTimeout(tick, default_tickrate);
  } else {
    endGame();
  }
}

export function startGame() {
  document.onkeydown = checkKey;
  snakegame = new game.Game(game.Game.default_config());
  snakegame.start();
  tickTimeout = setTimeout(tick, default_tickrate);
}

export function endGame() {
  clearTimeout(tickTimeout)
}