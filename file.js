
function saveGame() {
    localStorage.setItem("game", JSON.stringify(game));
}

function loadGame() {
    let savedGame = JSON.parse(localStorage.getItem("game"));
    if (savedGame != null) {
        game = savedGame;
        if (game.juicers > 0) setJuicerLoop();
    }
}

function resetSave() {
    localStorage.removeItem("game");
    window.removeEventListener("beforeunload", saveGame)
}

function loadIfPossible() {
    if (localStorage.getItem("game") != null) {
        loadGame();
    }
}

window.addEventListener('beforeunload', saveGame);
