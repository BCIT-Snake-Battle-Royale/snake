const sampleData = { "user1": { isAlive: true, score: 7 }, "user2": { isAlive: true, score: 12 } };
//var socket = io('http://localhost:4000');

//socket.on('updateHtml', function (data) {
    //let ct = document.getElementById("playersContainerLobby");
    //let player = document.createElement('li');
    //player.innerHTML = data.key;
    //ct.appendChild(player);
//});
//socket.on('disconnect', function () { });

function startGame() {
    document.getElementById("lobby").style.display = "none";
    showRankingPage(sampleData);
    // TODO: 
    // - Display game page
    // - Run game page
    // - Clear socket?
}

newGame = () => {
    let name = document.getElementById("username").value;
    if (name != "") {
        // socket.emit('startGame', { username: name });
        const landing = document.getElementById("landing");
        const lobby = document.getElementById("lobby");
        document.getElementById("main-title").style.display = 'none';
        document.getElementById("username").style.display = 'none';
        document.getElementById("host-game").style.display = 'none';
        document.getElementById("room-code").style.display = 'none';
        document.getElementById("join-game").style.display = 'none';
        landing.style.display = "none";
        lobby.style.display = "block";
    } else {
        alert("Please enter a username to host a game.");
    }
}

joinGame = () => {
    const landing = document.getElementById("landing");
    const lobby = document.getElementById("lobby");
    let name = document.getElementById("username").value;
    let code = document.getElementById("room-code").value;
    if (name != "" && code != "") {
        // socket.emit('joinGame', { username: name, 
        //                           roomCode: code });w
        document.getElementById("main-title").style.display = 'none';
        document.getElementById("username").style.display = 'none';
        document.getElementById("host-game").style.display = 'none';
        document.getElementById("room-code").style.display = 'none';
        document.getElementById("join-game").style.display = 'none';
        landing.style.display = "none";
        lobby.style.display = "block";
    } else {
        alert("Please enter a username and valid room code to join a game.");
    }
}

hideRankingPage = () => {

    document.getElementById("rankingPage").style.display = "none";
    document.getElementById("landing").style.display = "inherit";
    document.getElementById("main-title").style.display = "block";
    document.getElementById("username").style.display = "block";
    document.getElementById("host-game").style.display = "block";
    document.getElementById("room-code").style.display = "block";
    document.getElementById("join-game").style.display = "block";
}

showRankingPage = (playersStats) => {
    const rankingPage = document.getElementById("rankingPage");
    const listRankingPage = document.getElementById("listRankingPage");

    Object.keys(playersStats).forEach(playerName => {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(`${playerName} - ${playersStats[playerName].score} points`));
        li.setAttribute("class", "liRankingPage");
        listRankingPage.appendChild(li);
    });
    rankingPage.style.display = "block";
}

//const sampleData = { "user1": { isAlive: true, score: 7 }, "user2": { isAlive: true, score: 12 } };
//showRankingPage(sampleData);