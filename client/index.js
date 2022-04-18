import * as game from "lib-game-wasm";
import { io } from 'socket.io-client';
import * as multi from "./multiplayer/multiplayer"

let snakeGame = new game.Game(game.Game.default_config());
// console.log(snakeGame.config())
// console.log(snakeGame.snake())
const socket = io("ws://localhost:4321");
socket.emit("hello", { message: "world" })
socket.emit("gameState", snakeGame.config())

document.getElementById("new-game").addEventListener("click", () => {
    // console.log("hello")
    socket.emit("newGame", "startgame")
})
document.getElementById("start-game").addEventListener("click", () => {
    // console.log("hello")
    socket.emit("startGame", "startgame")
})

/*
Event listener structure:
socket.on("event-type", (data-from-server) => {
    // do something with data
})
*/

// TODO: Event listener for when the host pressed "start game"
socket.on("startGame", (data) => {
    // do something with data
})

// TODO: Event listener for when the host pressed "new game"
socket.on("newGame", (data) => {
    socket.broadcast.emit("allowPlayerJoin", { host: data.host })
    console.log(data)
})

// TODO: Event listener when the game ends/ someone has won
socket.on("gameEnd", (data) => {
    socket.emit("playerHasWon", { player: data.player, score: data.score })
    console.log(data)
})

// Event listener for updating game state and other player's scores/ rankings
// TODO: Update the front-end with this data
socket.on("gameState", (data) => {
    console.log(data)
})

// Emit the snakeGame's gamestate twice a second to the server
setInterval(() => {
    socket.broadcast.emit("gameState", snakeGame.config())
}, 500)

// TODO: Replace player name with the player userId has inputted
multi.updateStateHandler(snakeGame, socket, "room-code-name-here");

console.log(game.hello_world())
console.log(game.Game.default_config())

snakeGame.start();
multi.updateStateHandler(snakeGame, socket, "player-name-here");
console.log(snakeGame.config())
console.log(snakeGame.snake())
