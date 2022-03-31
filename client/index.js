import * as game from "lib-game-wasm";
import { io } from 'socket.io-client';

let snakeGame = new game.Game(game.Game.default_config());
console.log(snakeGame.config())
console.log(snakeGame.snake())

const socket = io("ws://localhost:4321");
let roomId;

// TEST CLIENT CODE
socket.emit("hello", { message: "world" })
socket.emit("gameState", snakeGame.config())

// CLIENT MESSAGE TO SERVER
// emit newGame message to server 
socket.emit("newGame");

// emit joinGame, {message: roomCode}

// emit startGame to server

// emit updateState to receive game status from
// the server 

// RECEIVE MESSAGES FROM SERVER
socket.on("newGame", (data) => {
    console.log(data);
})

// GAME LOGIC
// game loop

console.log(game.hello_world())
console.log(game.Game.default_config())

snakeGame.start();
console.log(snakeGame.config())
console.log(snakeGame.snake())
