import * as game from "lib-game-wasm";
import { io } from 'socket.io-client';
import * as multi from "./multiplayer/multiplayer"

let snakeGame = new game.Game(game.Game.default_config());
// console.log(snakeGame.config())
// console.log(snakeGame.snake())
const nicknameElement = document.getElementById("nickname-input");
const roomElement = document.getElementById("room-code-input");
const roomCodeElement = document.getElementById("room-code");
const lobbyGameStatesElement = document.getElementById("game-state");
const socket = io("ws://localhost:4321");
let roomId;
let updateInterval;

// TEST CLIENT CODE
socket.emit("hello", { message: "world" })
socket.emit("gameState", snakeGame.config())


document.getElementById("new-game").addEventListener("click", () => {
    // console.log("hello")
    //socket.emit("startGame", "startgame")

    multi.newGameHandler(socket, nicknameElement.value);
});

document.getElementById("join-game").addEventListener("click", () => {
    multi.joinGameHandler(socket, roomElement.value, nicknameElement.value);
});

document.getElementById("start-game").addEventListener("click", () => {
    multi.startGameHandler(socket, roomElement.value);
});

document.getElementById("end-game").addEventListener("click", () => {
    clearInterval(updateInterval);
    multi.endGameHandler(socket, nicknameElement.value);
});
/*
Event listener structure:
socket.on("event-type", (data-from-server) => {
    // do something with data
})
*/

// TODO: Event listener for when the host pressed "start game"
socket.on("startGame", (data) => {
    // do something with data

    // TODO: Replace roomId with the roomId retrieved from when the user joined/ started a game
    updateInterval = multi.updateStateHandler(snakeGame, socket, "testRoom");
})
// TODO: Event listener for when the host pressed "new game"
socket.on("newGame", (data) => {
    //socket.broadcast.emit("allowPlayerJoin", { host: data.host })
    console.log(data)
    roomCodeElement.innerHTML = data.roomId;
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
    lobbyGameStatesElement.innerHTML = data;
})

// Emit the snakeGame's gamestate twice a second to the server
// setInterval(() => {
//     //console.log(snakeGame.config());
//     socket.emit("gameState", snakeGame.config())
// }, 500)


// old
//multi.emitGameState(snakeGame, socket, "player-name-here");

// TODO, room Id should be saved somewhere and should be sent
socket.on("disconnect", () => {
    socket.emit("earlyDisconnect", roomElement.value);
});

console.log(game.hello_world())
console.log(game.Game.default_config())

snakeGame.start();
console.log(snakeGame.config())
console.log(snakeGame.snake())
