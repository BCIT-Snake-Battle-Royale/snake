import * as game from "lib-game-wasm";
import { io } from 'socket.io-client';
import * as multi from "./multiplayer/multiplayer"

// // button ids
const NEW_GAME_BTN = "new-game";
const JOIN_GAME_BTN = "join-game";
const START_GAME_BTN = "start-game";
const END_GAME_BTN = "end-game";
const BACK_BTN = "back-btn-ranking";
const COPY_CODE_BTN = "copy-code";

// // display elements
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

// leaderboard elements
const player0Name = document.getElementById("leaderboard-player-0-name");
const player0Score = document.getElementById("leaderboard-player-0-score");
const player1Name = document.getElementById("leaderboard-player-1-name");
const player1Score = document.getElementById("leaderboard-player-1-score");
const player2Name = document.getElementById("leaderboard-player-2-name");
const player2Score = document.getElementById("leaderboard-player-2-score");
const player3Name = document.getElementById("leaderboard-player-3-name");
const player3Score = document.getElementById("leaderboard-player-3-score");
const player4Name = document.getElementById("leaderboard-player-4-name");
const player4Score = document.getElementById("leaderboard-player-4-score");

const leaderboardInfo = [[player0Name, player0Score],
[player1Name, player1Score],
[player2Name, player2Score],
[player3Name, player3Score],
[player4Name, player4Score]];

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

// // TEST CLIENT CODE
// socket.emit("hello", { message: "world" })
// socket.emit("gameState", snakeGame.config())

// Setting event listeners for starting, joining, creating and ending games
document.getElementById(NEW_GAME_BTN).addEventListener("click", () => {
    multi.newGameHandler(socket, nicknameElement.value);
    document.getElementById(START_GAME_BTN).style.display='';
    document.getElementById(WAITING_MSG).style.display='none';
    document.getElementById(END_GAME_BTN).style.display='';
});

document.getElementById(BACK_BTN).addEventListener("click", () => {
    document.getElementById(RANKING_DIV).style.display = 'none';
    document.getElementById(LANDING_DIV).style.display = '';
    let ni = document.getElementById("nickname-input");
    ni.value = "";
    let rci = document.getElementById("room-code-input");
    rci.value = "";
});

document.getElementById(JOIN_GAME_BTN).addEventListener("click", () => {
    multi.joinGameHandler(socket, roomElement.value, nicknameElement.value);
    document.getElementById(START_GAME_BTN).style.display='none';
    document.getElementById(WAITING_MSG).style.display='';
    document.getElementById(END_GAME_BTN).style.display='none';
});

document.getElementById(START_GAME_BTN).addEventListener("click", () => {
    console.log(roomElement.value);
    multi.startGameHandler(socket, roomId);
});

document.getElementById(END_GAME_BTN).addEventListener("click", () => {
    clearInterval(updateInterval);
    multi.endGameHandler(socket, roomId, nicknameElement.value);
    document.getElementById(GAME_DIV).style.display = 'none';
    document.getElementById(RANKING_DIV).style.display = '';
});

document.getElementById(COPY_CODE_BTN).addEventListener("click", () => {
    navigator.clipboard.writeText(roomCodeElement.textContent);
    document.getElementById(COPY_CODE_BTN).style.display = "none";
    document.getElementById("copied-msg").style.display = "block";
    setTimeout(() => { 
        document.getElementById(COPY_CODE_BTN).style.display = "initial";
        document.getElementById("copied-msg").style.display = "initial";
    }, 1337);
})

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
    for (let i = 0; i < users.length; i++) {
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

    for (let i = 0; i < users.length; i++) {
        gameStates += users[i][USERNAME] + ", Score:" + users[i][SCORE] + ", State:" + (users[i][IS_ALIVE] ? " alive" : "dead") + "<br />";
    }

    updateLeaderboard(users);
    // lobbyGameStatesElement.innerHTML = gameStates;
}

// Leaderboard
const updateLeaderboard = (gameState) => {

    // Sort users by score
    gameState.sort((x, y) => {
        if (x.score < y.score) {
            return 1;
        } else {
            return -1;
        }
    });

    // Update display
    let i = 0;
    for (; i < gameState.length; i++) {
        if (gameState[i].isAlive) {
            leaderboardInfo[i][0].style.color = "#004d61";
            leaderboardInfo[i][1].style.color = "#004d61";
        };

        if (!gameState[i].isAlive) {
            leaderboardInfo[i][0].style.color = "#cf2d50";
            leaderboardInfo[i][1].style.color = "#cf2d50";
        };

        leaderboardInfo[i][0].innerHTML = gameState[i].username + ": ";
        leaderboardInfo[i][1].innerHTML = gameState[i].score;
    }

    for (; i < 5; i++) {
        leaderboardInfo[i][0].innerHTML = "";
        leaderboardInfo[i][1].innerHTML = "";
    };
}

// Display rankings (nickname and score) at the end when everyone has died
const displayRankings = (data) => {
    let gameStates = "";
    const clients = data;
    delete clients[NUM_USERS];
    let users = Object.values(clients);

    // Sort users by scores, NOTE: has not been tested yet since the score for all users is hardcoded to 0
    users.sort((a, b) => { return a.score - b.score });

    // Reset lobby
    let ul = document.getElementById("rankings");
    ul.innerHTML = "";

    // Get all nicknames from users

    for(let i = 0 ; i < users.length; i++) {
        let snake = document.createElement('li');
        snake.innerHTML = (i + 1) + ": " + users[i][USERNAME] + ", Score:" + users[i][SCORE];
        ul.appendChild(snake);
    }
}

// Socket event listeners
socket.on(START_GAME, (data) => {
    document.getElementById(LOBBY_DIV).style.display = 'none';
    document.getElementById(GAME_DIV).style.display = '';
    updateInterval = multi.updateStateHandler(snakeGame, socket, roomId, nicknameElement.value);
})


// Event listener for when the host pressed "new game"
socket.on(NEW_GAME, (data) => {
    console.log(data);
    if (data.status === SUCCESS) {
        document.getElementById(LANDING_DIV).style.display = 'none'; // Hide landing Div
        document.getElementById(LOBBY_DIV).style.display = '';
        setUsernames(data);
    } else {
        document.getElementById(ERROR_MSG).innerHTML = data.msg;
    }
})

// Event listener when the game ends/ someone has won
socket.on(END_GAME, (data) => {
    document.getElementById(GAME_DIV).style.display = 'none';
    document.getElementById(RANKINGS_DISPLAY).style.display = '';
    displayRankings(data);
})

// Event listener for updating game state and other player's scores/ rankings
socket.on(GAME_STATE, (data) => {
    displayGameState(data);
})

// Event listener for when a user joins a lobby
socket.on(JOIN_GAME, (data) => {
    if (data.status === SUCCESS) {
        document.getElementById(LANDING_DIV).style.display = 'none'; // Hide landing Div
        document.getElementById(LOBBY_DIV).style.display = '';
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
