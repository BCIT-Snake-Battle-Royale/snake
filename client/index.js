import * as game from "lib-game-wasm";
import { io } from 'socket.io-client';

let snakeGame = new game.Game(game.Game.default_config());
console.log(snakeGame.config())
console.log(snakeGame.snake())

const socket = io("ws://localhost:4321");
socket.emit("hello", { message: "world" })
socket.emit("gameState", snakeGame.config())

console.log(game.hello_world())
console.log(game.Game.default_config())
