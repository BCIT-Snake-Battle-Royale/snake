import { Socket } from "socket.io-client"
export * from "./multiplayer.js"

// Use the snakeGame config method to get the length, width and height of the snake
// TODO: Add the death flag from the snake config once available
export function emitGameState(snakeGame, socket, name) {
    const config = snakeGame.config();
    const gs = {grid_width: config.grid_width, 
        grid_height: config.grid_height, 
        length: config.snake_init_pos.length,
        name: name}
    setInterval(() => {
        socket.emit("gameState", gs)
    }, 500);
}
