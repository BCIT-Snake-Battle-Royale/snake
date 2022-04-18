const createLeaderboard = () => {
    // Create leaderboard
    const leaderboard = document.createElement("div");
    leaderboard.setAttribute("id", "leaderboard");

    // Create player rows (5)
    for (let i = 0; i < 5; i++) {
        const row = document.createElement("div");
        row.setAttribute("class", "leaderboard-row");

        if (i % 2 == 1) {
            row.setAttribute("class", "leaderboard-row leaderboard-row-even");
        };

        const name = document.createElement("p");
        const score = document.createElement("p");

        const id = "leaderboard-player-" + i;
        name.setAttribute("id", id + "-name");
        name.setAttribute("class", "leaderboard-player-name");
        score.setAttribute("id", id + "-score");
        score.setAttribute("class", "leaderboard-player-score");

        row.appendChild(name)
        row.appendChild(score)

        leaderboard.appendChild(row)
    }

    // Add leaderboard to game display
    const game = document.getElementById("game");
    game.insertBefore(leaderboard, game.children[0]);
}



// ====================================================================

        // CLARIFY GAME STATE FORMAT

// ====================================================================




// assuming gameState = {username1: {score: 0, isAlive: true}, username2: {score: 0, isAlive: true}}
const updateLeaderboard = (gameState) => {

    // leaderboard 
    const leaderboard = document.getElementById("leaderboard");
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
                             
    let users = Object.entries(gameState);
    let i = 0;
    // Sort users by score
    users.sort((x, y) => {
        if (x[1].score < y[1].score) {
            return 1;
        } else {
            return -1;
        }
    });
    for (; i < users.length; i++) {
        leaderboardInfo[i][0].innerHTML = users[i][0] + ": ";
        leaderboardInfo[i][1].innerHTML = users[i][1].score;
    };

    for (; i < 5; i++) {
        leaderboardInfo[i][0].innerHTML = "";
        leaderboardInfo[i][1].innerHTML = "";
    };
}