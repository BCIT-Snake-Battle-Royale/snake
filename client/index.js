import * as game from "lib-game-wasm";
import { io } from 'socket.io-client';

const socket = io("ws://localhost:4321");

console.log(game.hello_world())
console.log(game.Game.default_config())

let snakeGame = new game.Game(game.Game.default_config());

console.log(snakeGame.config())
console.log(snakeGame.snake())