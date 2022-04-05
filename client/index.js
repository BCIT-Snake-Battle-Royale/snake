import * as game from "lib-game-wasm";
import { io } from 'socket.io-client';
import * as multi from "./multiplayer/multiplayer"

let snakeGame = new game.Game(game.Game.default_config());
console.log(snakeGame.config())
console.log(snakeGame.snake())

const socket = io("ws://localhost:4321");
socket.emit("hello", { message: "world" })
socket.emit("gameState", snakeGame.config())

/*
Event listener structure:
socket.on("event-type", (data-from-server) => {
    // do something with data
})
*/

// TODO: Event listener for when the host pressed "start game"

// TODO: Event listener for when the host pressed "new game"
socket.on("newGame", (data) => {
    socket.broadcast.emit("allowPlayerJoin", { host: data.host })
    console.log(data)
})

// TODO: Event listener when someone has won
socket.on("gameEnd", (data) => {
    socket.emit("playerHasWon", { player: data.player, score: data.score })
    console.log(data)
})

// TODO: Event listener for updating other players' snake lengths locally

// TODO: Event emitter for when a player has joined the game


// Socket functions for the host
// TODO: Event emitter for when the host presses "new game" and updates the front end with the waiting room UI

// TODO: Event emitter for when the host presses "start game"

// Receive the gamestate from the server
socket.on("gameState", (data) => {
    console.log(data)
})

// Emit the snakeGame's gamestate twice a second to the server
setInterval(() => {
    socket.broadcast.emit("gameState", snakeGame.config())
}, 500)

// TODO: Replace player name with the actual name that the player has inputted
multi.emitGameState(snakeGame, socket, "player-name-here");

console.log(game.hello_world())
console.log(game.Game.default_config())

snakeGame.start();
console.log(snakeGame.config())
console.log(snakeGame.snake())
