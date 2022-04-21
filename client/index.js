import * as game from "lib-game-wasm";
import { io } from 'socket.io-client';
import * as multiplayer from "./multiplayer/multiplayer"

// button ids
const NEW_GAME_BTN = "new-game";
const JOIN_GAME_BTN = "join-game";
const START_GAME_BTN = "start-game";
const END_GAME_BTN = "end-game";

// display elements
const NICK_INPUT = "nickname-input";
const CODE_INPUT = "room-code-input";
const CODE_DISPLAY = "room-code";
const GAME_STATE_DISPLAY = "game-state";
const PLAYERS_DISPLAY = "room-players";
const RANKINGS_DISPLAY = "rankings";

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

// // let snakeGame = new game.Game(game.Game.default_config());
// // console.log(snakeGame.config())
// // console.log(snakeGame.snake())
const nicknameElement = document.getElementById(NICK_INPUT);
const roomElement = document.getElementById(CODE_INPUT);
// const roomCodeElement = document.getElementById(CODE_DISPLAY);
// const lobbyGameStatesElement = document.getElementById(GAME_STATE_DISPLAY);
// const lobbyPlayersElement = document.getElementById(PLAYERS_DISPLAY);
// const rankingsElement = document.getElementById(RANKINGS_DISPLAY);
const socket = io("ws://localhost:4321");
let roomId = undefined;
let updateInterval;

// // TEST CLIENT CODE
// // socket.emit("hello", { message: "world" })
// // socket.emit("gameState", snakeGame.config())

// Setting event listeners for starting, joining, creating and ending games
document.getElementById(NEW_GAME_BTN).addEventListener("click", () => {
    console.log(nicknameElement.value)
    multiplayer.newGameHandler(socket, nicknameElement.value);
    if (nicknameElement.value != "") {
        // socket.emit('startGame', { username: name });
        document.getElementById("main-div").style.display = 'none';
        document.getElementById("lobby").style.display = 'flex';
        // document.getElementById("main-title").style.display = 'none';
        // document.getElementById("nickname-input").style.display = 'none';
        // document.getElementById("new-game").style.display = 'none';
        // document.getElementById("room-code-input").style.display = 'none';
        // document.getElementById("join-game").style.display = 'none';
    } else {
        alert("Please enter a username to host a game.");
    }
});

document.getElementById(JOIN_GAME_BTN).addEventListener("click", () => {
    multiplayer.joinGameHandler(socket, roomElement.value, nicknameElement.value);
});

document.getElementById(START_GAME_BTN).addEventListener("click", () => {
    console.log(roomElement.value);
    multiplayer.startGameHandler(socket, roomId);
});

// document.getElementById(END_GAME_BTN).addEventListener("click", () => {
//     clearInterval(updateInterval);
//     multiplayer.endGameHandler(socket, roomId, nicknameElement.value);
// });

// // Everytime a user joins a room, display the roomcode and the users in that room
// const setUsernames = (data) => {
//     let usernames = "";
//     const clients = data[STATE];
//     // Don't need to display number of users, only want the users
//     delete clients[NUM_USERS];
//     let users = Object.values(clients);

//     // Get all nicknames from users
//     for(let i = 0 ; i < users.length; i++) {
//         usernames += users[i][USERNAME] + " ";
//     }

//     lobbyPlayersElement.innerHTML = usernames;
//     roomCodeElement.innerHTML = users[0][ROOM_ID];
//     roomId = users[0][ROOM_ID];
// }

// // Display the score and isAlive state for each players' snake game
// const displayGameState = (data) => {
//     let gameStates = "";
//     const clients = data;
//     // Don't need to display number of users, only want the users
//     delete clients[NUM_USERS];
//     let users = Object.values(clients);

//     for(let i = 0 ; i < users.length; i++) {
//         gameStates += users[i][USERNAME] + ", Score:" + users[i][SCORE] + ", State:" + (users[i][IS_ALIVE] ? " alive" : "dead") + "<br />";
//     }

//     lobbyGameStatesElement.innerHTML = gameStates;
// }

// // Display rankings (nickname and score) at the end when everyone has died
// const displayRankings = (data) => {
//     let gameStates = "";
//     const clients = data;
//     delete clients[NUM_USERS];
//     let users = Object.values(clients);

//     // Sort users by scores, NOTE: has not been tested yet since the score for all users is hardcoded to 0
//     users.sort((a, b) => {return a.score - b.score});

//     for(let i = 0 ; i < users.length; i++) {
//         gameStates += (i+1) + ": " + users[i][USERNAME] + ", Score:" + users[i][SCORE] + "<br />";
//     }

//     rankingsElement.innerHTML = gameStates;
// }

// // Socket event listeners
// socket.on(START_GAME, (data) => {
//     updateInterval = multiplayer.updateStateHandler(snakeGame, socket, roomId, nicknameElement.value);
// })

// // Event listener for when the host pressed "new game"
// socket.on(NEW_GAME, (data) => {
//     if (data.status === SUCCESS) {
//         setUsernames(data);
//     }
// });

// // Event listener when the game ends/ someone has won
// socket.on(END_GAME, (data) => {
//     displayRankings(data);
// });

// // Event listener for updating game state and other player's scores/ rankings
// socket.on(GAME_STATE, (data) => {
//     displayGameState(data);
// })

// // Event listener for when a user joins a lobby
// socket.on(JOIN_GAME, (data) => {
//     if (data.status === SUCCESS) {
//         setUsernames(data);
//     }
// });

// console.log(game.hello_world())
// console.log(game.Game.default_config())

// // snakeGame.start();
// // console.log(snakeGame.config())
// // console.log(snakeGame.snake())
