const markX = document.querySelector('.mark-option.x');
const markO = document.querySelector('.mark-option.o');
const btnCpu = document.querySelector('.btn-cpu');
const chooseMark = document.querySelector('.card');

const btnPlayer = document.querySelector('.btn-player');
const nameSection = document.getElementById('player-name-section');
const startGameBtn = document.getElementById('start-game-btn');
const startGameBtnCpu = document.getElementById('start-game-btn-cpu');

const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');

let gameData = {
    playerOne: 'Player 1',
    playerTwo: 'Player 2',
    mark: 'X',
    mode: null
};

markX.addEventListener('click', () => {
    gameData.mark = 'X';
    markX.classList.add('active');
    markO.classList.remove('active');
});

markO.addEventListener('click', () => {
    gameData.mark = 'O';
    markO.classList.add('active');
    markX.classList.remove('active');
});

btnCpu.addEventListener('click', () => {
    chooseMark.style.display = 'flex';

});



btnPlayer.addEventListener('click', () => {
    gameData.mode = 'player';
    nameSection.style.display = 'flex';
});
startGameBtnCpu.addEventListener('click', () => {
    gameData.mode = 'cpu';
    saveToLocal();
    window.location.href = 'board.html';

})
startGameBtn.addEventListener('click', () => {
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');

    gameData.playerOne = player1Input.value.trim() || 'Player 1';
    gameData.playerTwo = player2Input.value.trim() || 'Player 2';

    saveToLocal();
    resetGame()
    window.location.href = 'board.html';

});

function saveToLocal() {

    gameData.playerOne = player1Input?.value.trim() || 'Player 1';
    gameData.playerTwo = player2Input?.value.trim() || 'Player 2';

    let allGames = JSON.parse(localStorage.getItem('allGames')) || [];

    allGames.push({ ...gameData, timestamp: Date.now() });

    localStorage.setItem('allGames', JSON.stringify(allGames));
}

function resetGame() {

    gameData = {
        playerOne: 'Player 1',
        playerTwo: 'Player 2',
        mark: 'X',
        mode: null
    };

    markX.classList.add('active');
    markO.classList.remove('active');

    if (player1Input) player1Input.value = 'Player 1';
    if (player2Input) player2Input.value = 'Player 2';

    const nameSection = document.getElementById('player-name-section');
    if (nameSection) nameSection.style.display = 'none';
}
