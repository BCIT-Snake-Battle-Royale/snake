import * as game from "lib-game-wasm";
import { io } from 'socket.io-client';

let x = 250.0;
let y = 250.0;

let snakeGame = new game.Game(game.Game.default_config());
console.log(snakeGame.config())
console.log(snakeGame.snake())

const socket = io("ws://localhost:4321");
socket.emit("hello", { message: "world" })
socket.emit("gameState", snakeGame.config())

console.log(game.hello_world())
console.log(game.Game.default_config())

snakeGame.start();
console.log(snakeGame.config())
console.log(snakeGame.snake())

document.onkeydown = checkKey;

function checkKey(e) {
  e = e || window.event;

  if (e.keyCode == '38') {
    // up arrow
  }
  else if (e.keyCode == '40') {
    // down arrow
  }
  else if (e.keyCode == '37') {
    // left arrow
  }
  else if (e.keyCode == '39') {
    // right arrow
  }
}

setInterval(() => {
  x += 10;
  snakeGame.tick(x, y);
}, 1000);
