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
const lobbyPlayersElement = document.getElementById("room-players");
const rankingsElement = document.getElementById("rankings");
const socket = io("ws://localhost:4321");
let roomId = undefined;
let updateInterval;

// TEST CLIENT CODE
// socket.emit("hello", { message: "world" })
// socket.emit("gameState", snakeGame.config())

document.getElementById("new-game").addEventListener("click", () => {
    // console.log("hello")
    //socket.emit("startGame", "startgame")

    multi.newGameHandler(socket, nicknameElement.value);
});

document.getElementById("join-game").addEventListener("click", () => {
    multi.joinGameHandler(socket, roomElement.value, nicknameElement.value);
});

document.getElementById("start-game").addEventListener("click", () => {
    console.log(roomElement.value);
    multi.startGameHandler(socket, roomId);
});

document.getElementById("end-game").addEventListener("click", () => {
    clearInterval(updateInterval);
    multi.endGameHandler(socket, roomId, nicknameElement.value);
});
/*
Event listener structure:
socket.on("event-type", (data-from-server) => {
    // do something with data
})
*/

const setUsernames = (data) => {
    let usernames = "";
    const clients = data["state"];
    delete clients["numUsers"];
    let users = Object.values(clients);

    for(let i = 0 ; i < users.length; i++) {
        usernames += users[i]["username"] + " ";
    }

    lobbyPlayersElement.innerHTML = usernames;
    roomCodeElement.innerHTML = users[0]["roomId"];
    roomId = users[0]["roomId"];
}

const displayGameState = (data) => {
    let gameStates = "";
    const clients = data;
    delete clients["numUsers"];
    let users = Object.values(clients);

    for(let i = 0 ; i < users.length; i++) {
        gameStates += users[i]["username"] + ", Score:" + users[i]["score"] + ", State:" + (users[i]["isAlive"] ? " alive" : "dead") + "<br />";
    }

    lobbyGameStatesElement.innerHTML = gameStates;
}

const displayRankings = (data) => {
    let gameStates = "";
    const clients = data;
    delete clients["numUsers"];
    let users = Object.values(clients);
    users.sort((a, b) => {return a.score - b.score});

    for(let i = 0 ; i < users.length; i++) {
        gameStates += (i+1) + ": " + users[i]["username"] + ", Score:" + users[i]["score"] + "<br />";
    }

    rankingsElement.innerHTML = gameStates;
}

// TODO: Event listener for when the host pressed "start game"
socket.on("startGame", (data) => {
    console.log(data);

    // TODO: Replace roomId and usernames with the ones retrieved from when the user joined/ started a game
    updateInterval = multi.updateStateHandler(snakeGame, socket, roomId, nicknameElement.value);
})

// TODO: Event listener for when the host pressed "new game"
socket.on("newGame", (data) => {
    //socket.broadcast.emit("allowPlayerJoin", { host: data.host })
    console.log(data)
    setUsernames(data);
})

// TODO: Event listener when the game ends/ someone has won
socket.on("endGame", (data) => {
    //socket.emit("playerHasWon", { player: data.player, score: data.score })
    console.log("gameEnded");
    console.log(data)
    displayRankings(data);
})

// Event listener for updating game state and other player's scores/ rankings
// TODO: Update the front-end with this data
socket.on("gameState", (data) => {
    console.log("gameState");
    console.log(data)
    displayGameState(data);
})

socket.on("joinGame", (data) => {
    console.log(data)
    setUsernames(data);
});

socket.on("disconnect", () => {
    socket.emit("earlyDisconnect", roomId);
});

console.log(game.hello_world())
console.log(game.Game.default_config())

snakeGame.start();
console.log(snakeGame.config())
console.log(snakeGame.snake())
