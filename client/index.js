import * as game from "lib-game-wasm";
import { io } from 'socket.io-client';

let x = 250.0;
let y = 250.0;
let current_dir = [0, 0];

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
// TODO: modify snake direction not random x,y values
function checkKey(e) {

  e = e || window.event;

  if (e.keyCode == '38') {
    // up
    current_dir[0] = 1
    current_dir[1] = 0

  }
  else if (e.keyCode == '40') {
    // down
    current_dir[0] = 1
    current_dir[1] = 1
  }
  else if (e.keyCode == '37') {
    // left
    current_dir[0] = 0
    current_dir[1] = 0
  }
  else if (e.keyCode == '39') {
    // right
    current_dir[0] = 0
    current_dir[1] = 1
  }

}

setInterval(() => {
  if (current_dir[0] === 1) {
    switch (current_dir[1]) {
      case 0:
        y -= 10;
        break;
      case 1:
        y += 10;
        break;
    }
  } else {
    switch (current_dir[1]) {
      case 0:
        x -= 10;
        break;
      case 1:
        x += 10;
        break;
    }
  }

  snakeGame.tick(x, y);
}, 70);