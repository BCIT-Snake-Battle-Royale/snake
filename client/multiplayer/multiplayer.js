import { Socket } from "socket.io-client"
export * from "./multiplayer.js"

// Event emitter for sending data to the server twice a second
// Uses the snakeGame config method to get the length, width and height of the snake
// TODO: Add the death flag from the snake config once available
export function updateStateHandler(snakeGame, socket, name) {
    const config = snakeGame.config();
    const gs = {
        grid_width: config.grid_width, 
        grid_height: config.grid_height, 
        length: config.snake_init_pos.length,
        name: name}
    setInterval(() => {
        socket.emit("gameState", gs)
    }, 10500);
}

// Socket emitter Function for emitting to the server that a client has joined a lobby
export function joinGameHandler(roomCode) {
    socket.emit("joinGame", roomCode);
}

// TODO:
// Socket emitter function for emitting to the server that a client has left a lobby


// Socket functions for the lobby hosts
// TODO: Event emitter for when the host presses "new game" and updates the front end with the waiting room UI

// TODO: Event emitter for when the host presses "start game"
