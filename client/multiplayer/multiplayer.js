import { Socket } from "socket.io-client"
export * from "./multiplayer.js"

// Event emitter for sending data to the server twice a second
// Uses the snakeGame config method to get the length, width and height of the snake
// TODO: Add the death flag from the snake config once available
export function updateStateHandler(snakeGame, socket, roomId, username) {
    const config = snakeGame.config();
    // Game state should have the isAlive boolean retrieved from the snakegame config
    const gs = {
        isAlive: true,
        username: username,
        score: 0
    };
    let interval = setInterval(() => {
        console.log(roomId)
        socket.emit("gameState", {roomId: roomId, userState: gs});
    }, 500);

    return interval;
}

// Socket emitter Function for emitting to the server that a client has joined a lobby
export function joinGameHandler(socket, roomId, username) {
    socket.emit("joinGame", {roomId: roomId, username: username});
}

// Socket functions for the lobby hosts
// TODO: Event emitter for when the host presses "new game" and updates the front end with the waiting room UI
export function newGameHandler(socket, username) {
    socket.emit("newGame", {username: username});
}

// TODO: Event emitter for when the host presses "start game"
export function startGameHandler(socket, roomId) {
    socket.emit("startGame", {roomId: roomId});
}

// Temporary function for ending the snake game
export function endGameHandler(socket, roomId, username) {
    socket.emit("gameState", {roomId: roomId, userState: {isAlive: false, score:0, username: username}});
}
