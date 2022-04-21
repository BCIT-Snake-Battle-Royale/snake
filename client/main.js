// import { io } from 'socket.io-client';

// const socket = io('http://localhost:4321');

const newGame = () => {
    let name = document.getElementById("username").value;
    console.log(name)
    if (name != "") {
        // socket.emit('startGame', { username: name });
        document.getElementById("main-title").style.display = 'none';
        document.getElementById("username").style.display = 'none';
        document.getElementById("host-game").style.display = 'none';
        document.getElementById("room-code").style.display = 'none';
        document.getElementById("join-game").style.display = 'none';
    } else {
        alert("Please enter a username to host a game.");
    }
}

document.getElementById('host-game').addEventListener("click", newGame);

export const joinGame = () => {
    let name = document.getElementById("username").value;
    let code = document.getElementById("room-code").value;
    if (name != "" && code != "") {
        // socket.emit('joinGame', { username: name, 
        //                           roomCode: code });
        document.getElementById("main-title").style.display = 'none';
        document.getElementById("username").style.display = 'none';
        document.getElementById("host-game").style.display = 'none';
        document.getElementById("room-code").style.display = 'none';
        document.getElementById("join-game").style.display = 'none';
    } else {
        alert("Please enter a username and valid room code to join a game.");
    }
}