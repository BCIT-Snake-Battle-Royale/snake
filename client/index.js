import * as game from "lib-game-wasm";
import { io } from 'socket.io-client';
import * as multi from "./multiplayer/multiplayer"

// button ids
const NEW_GAME_BTN = "new-game";
const JOIN_GAME_BTN = "join-game";
const START_GAME_BTN = "start-game";
//const END_GAME_BTN = "end-game";

// display elements
const NICK_INPUT = "nickname-input";
const CODE_INPUT = "room-code-input";
const CODE_DISPLAY = "room-code"
const GAME_STATE_DISPLAY = "game-state";
const PLAYERS_DISPLAY = "room-players";
const RANKINGS_DISPLAY = "rankings";
const WAITING_MSG = "waiting-msg";
const ERROR_MSG = "error-msg";

// divs
const LANDING_DIV = "landing-div";
const LOBBY_DIV = "lobby-div";
const GAME_DIV = "game-div";
const RANKING_DIV = "ranking-div";

// event emitter topics
const NEW_GAME = "newGame";
const JOIN_GAME = "joinGame";
const GAME_STATE = "gameState";
const START_GAME = "startGame";
const END_GAME = "endGame";

// state object attributes
const STATE = "state";
const USERNAME = "username";
const NUM_USERS = "numUsers";
const ROOM_ID = "roomId";
const SCORE = "score";
const IS_ALIVE = "isAlive";

// Status messages from server 
const SUCCESS = "success";

let snakeGame = new game.Game(game.Game.default_config());   
// console.log(snakeGame.config())
// console.log(snakeGame.snake())
const nicknameElement = document.getElementById(NICK_INPUT);
const roomElement = document.getElementById(CODE_INPUT);
const roomCodeElement = document.getElementById(CODE_DISPLAY);
const lobbyGameStatesElement = document.getElementById(GAME_STATE_DISPLAY);
const lobbyPlayersElement = document.getElementById(PLAYERS_DISPLAY);
const rankingsElement = document.getElementById(RANKINGS_DISPLAY);
const socket = io("ws://localhost:4321");
let roomId = undefined;
let updateInterval;

// TEST CLIENT CODE
// socket.emit("hello", { message: "world" })
// socket.emit("gameState", snakeGame.config())

// Setting event listeners for starting, joining, creating and ending games
document.getElementById(NEW_GAME_BTN).addEventListener("click", () => {
    multi.newGameHandler(socket, nicknameElement.value);
    document.getElementById(START_GAME_BTN).style.display='block';
    document.getElementById(WAITING_MSG).style.display='none';
    //document.getElementById(END_GAME_BTN).style.display='block';
});

document.getElementById(JOIN_GAME_BTN).addEventListener("click", () => {
    multi.joinGameHandler(socket, roomElement.value, nicknameElement.value);
    document.getElementById(START_GAME_BTN).style.display='none';
    document.getElementById(WAITING_MSG).style.display='block';
    //document.getElementById(END_GAME_BTN).style.display='none';
});

document.getElementById(START_GAME_BTN).addEventListener("click", () => {
    console.log(roomElement.value);
    multi.startGameHandler(socket, roomId);
});

//document.getElementById(END_GAME_BTN).addEventListener("click", () => {
//    clearInterval(updateInterval);
//    multi.endGameHandler(socket, roomId, nicknameElement.value);
//    document.getElementById(GAME_DIV).style.display = 'none';
//    document.getElementById(RANKING_DIV).style.display = 'block';
//});

// Everytime a user joins a room, display the roomcode and the users in that room
const setUsernames = (data) => {
    let usernames = "";
    const clients = data[STATE];
    // Don't need to display number of users, only want the users
    delete clients[NUM_USERS];
    let users = Object.values(clients);

    // Reset lobby
    let ul = document.getElementById("room-players"); 
    ul.innerHTML = "";

    // Get all nicknames from users
    for(let i = 0 ; i < users.length; i++) {
        let snake = document.createElement('li');
        snake.innerHTML = users[i][USERNAME];
        ul.appendChild(snake);
    }

    roomCodeElement.innerHTML = users[0][ROOM_ID];
    roomId = users[0][ROOM_ID];
}

// Display the score and isAlive state for each players' snake game
const displayGameState = (data) => {
    let gameStates = "";
    const clients = data;
    // Don't need to display number of users, only want the users
    delete clients[NUM_USERS];
    let users = Object.values(clients);

    for(let i = 0 ; i < users.length; i++) {
        gameStates += users[i][USERNAME] + ", Score:" + users[i][SCORE] + ", State:" + (users[i][IS_ALIVE] ? " alive" : "dead") + "<br />";
    }
    lobbyGameStatesElement.innerHTML = gameStates;
}

// Display rankings (nickname and score) at the end when everyone has died
const displayRankings = (data) => {
    let gameStates = "";
    const clients = data;
    delete clients[NUM_USERS];
    let users = Object.values(clients);

    // Sort users by scores, NOTE: has not been tested yet since the score for all users is hardcoded to 0
    users.sort((a, b) => {return a.score - b.score});

    // Reset lobby
    let ul = document.getElementById("rankings"); 
    ul.innerHTML = "";

    // Get all nicknames from users

    for(let i = 0 ; i < users.length; i++) {
        let snake = document.createElement('li');
        snake.innerHTML = (i+1) + ": " + users[i][USERNAME] + ", Score:" + users[i][SCORE];
        ul.appendChild(snake);
    }
}

// Socket event listeners
socket.on(START_GAME, (data) => {
    document.getElementById(LOBBY_DIV).style.display='none';
    document.getElementById(GAME_DIV).style.display='block';
    updateInterval = multi.updateStateHandler(snakeGame, socket, roomId, nicknameElement.value);
})


// Event listener for when the host pressed "new game"
socket.on(NEW_GAME, (data) => {
    console.log(data);
    if (data.status === SUCCESS) {
        document.getElementById(LANDING_DIV).style.display='none'; // Hide landing Div
        document.getElementById(LOBBY_DIV).style.display='block';
        setUsernames(data);
    } else {
        document.getElementById(ERROR_MSG).innerHTML = data.msg;
    }
})

// Event listener when the game ends/ someone has won
socket.on(END_GAME, (data) => {
    document.getElementById(GAME_DIV).style.display='none';
    document.getElementById(RANKINGS_DISPLAY).style.display='block';
    displayRankings(data);
})

// Event listener for updating game state and other player's scores/ rankings
socket.on(GAME_STATE, (data) => {
    displayGameState(data);
})

// Event listener for when a user joins a lobby
socket.on(JOIN_GAME, (data) => {
    if (data.status === SUCCESS) {
        document.getElementById(LANDING_DIV).style.display='none'; // Hide landing Div
        document.getElementById(LOBBY_DIV).style.display='block';
        setUsernames(data);
    } else {
        document.getElementById(ERROR_MSG).innerHTML = data.msg;
    }
});

console.log(game.hello_world())
console.log(game.Game.default_config())

snakeGame.start();
console.log(snakeGame.config())
console.log(snakeGame.snake())
