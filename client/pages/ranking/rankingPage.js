hideRankingPage = () => {
    const rankingPage = document.getElementById("rankingPage");
    const startPage = document.getElementById("startPage");
    rankingPage.style.display = "none";
    startPage.style.display  = "block";
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

const sampleData = {"user1": {isAlive: true, score: 7}, "user2": {isAlive: true, score: 12}};
showRankingPage(sampleData);