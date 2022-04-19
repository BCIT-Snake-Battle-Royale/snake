import * as game from "lib-game-wasm";
import { io } from 'socket.io-client';

let x = 250.0;
let y = 250.0;
let current_dir = [0, 0];
let default_tickrate = 100;

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

  if (e.keyCode == '38' || e.keyCode == '87') {
    // up
    current_dir[0] = 1
    current_dir[1] = 0

  }
  else if (e.keyCode == '40' || e.keyCode == '83') {
    // down
    current_dir[0] = 1
    current_dir[1] = 1
  }
  else if (e.keyCode == '37' || e.keyCode == '65') {
    // left
    current_dir[0] = 0
    current_dir[1] = 0
  }
  else if (e.keyCode == '39' || e.keyCode == '68') {
    // right
    current_dir[0] = 0
    current_dir[1] = 1
  }

}

// setInterval(() => {
//   let tickConfig = {
//     direction_vector: current_dir,
//   };

//   let curConfig = snakeGame.tick(tickConfig);
//   console.log(curConfig);
// }, 70);



let tickConfig
var tick = function () {
  tickConfig = {
    direction_vector: current_dir,
  };
  let curConfig = snakeGame.tick(tickConfig);
  setTimeout(tick, curConfig.tickrate);
}
setTimeout(tick, default_tickrate);
