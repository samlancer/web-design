// گرفتن عناصر از HTML
const cells = document.querySelectorAll(".board .number");
const turnText = document.querySelector(".player-mask");
const reloadBtn = document.querySelector(".reload img");

const xScoreEl = document.querySelector("#xScore");
const oScoreEl = document.querySelector("#oScore");
const tieScoreEl = document.querySelector("#ties");
const player1 = document.querySelector('.u-score')
const player2 = document.querySelector('.opp-score')


const modal = document.querySelector(".modal");
const winnerText = document.querySelector(".winner-text");
const btnNext = document.querySelector(".btn-next");
const btnQuit = document.querySelector(".btn-quit");

// خواندن لیست بازی‌ها
const allGames = JSON.parse(localStorage.getItem("allGames")) || [];

// گرفتن آخرین بازی
const gameData = allGames[allGames.length - 1]


let board = ["", "", "", "", "", "", "", "", ""];
let scores = { X: 0, O: 0, TIE: 0 };
let gameOver = false;
let isCpu = gameData.mode === "cpu";

// تعیین اینکه بازیکن انسان کیه
const userMark = gameData.mark.toUpperCase(); // "X" یا "O"
const cpuMark = userMark === "X" ? "O" : "X";

// همیشه X شروع می‌کند
let currentPlayer = "X";

// بروز رسانی متن نوبت
function updateTurnDisplay() {
  turnText.textContent = `${currentPlayer}'s Turn`;
}

// بررسی برنده
function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // "X" یا "O"
    }
  }

  if (!board.includes("")) return "TIE";

  return null;
}

// نمایش نتیجه بازی
function handleGameOver(result) {
  gameOver = true;

  const modalTitle = document.querySelector(".modal-title");
  const winnerIcon = document.querySelector(".winner-text .x-icon img");
  const winnerLabel = document.querySelector(".winner-text span:last-child");

  if (result === "TIE") {
    modalTitle.textContent = "ROUND TIED";
    winnerIcon.style.display = "none";
    winnerLabel.textContent = "No one wins this round";
  } else {
    const isUser = result === userMark;
    modalTitle.textContent = isUser ? "YOU WON!" : "OH NO, YOU LOST...";
    winnerIcon.src = `./asset/icon-${result.toLowerCase()}.svg`;
    winnerIcon.style.display = "inline-block";
    winnerLabel.textContent = `TAKES THE ROUND`;
  }

  updateScores(result);
  modal.classList.remove("d-none");
  modal.classList.add("d-active");
}


// بروزرسانی امتیازها
function updateScores(result) {
  if (result === "X") {
    scores.X++;
    xScoreEl.textContent = scores.X;
  } else if (result === "O") {
    scores.O++;
    oScoreEl.textContent = scores.O;
  } else {
    scores.TIE++;
    tieScoreEl.textContent = scores.TIE;
  }
}

// عملکرد حرکت بازیکن
function handlePlayerMove(index) {
  // Always block if cell filled or game over
  if (board[index] !== "" || gameOver) return;

  // Only block on the "not your turn" rule when vs CPU
  if (isCpu && currentPlayer !== userMark) return;

  board[index] = currentPlayer;
  if (currentPlayer == "X") {
    addX(index)
  } else {
    addO(index)
  }


  const result = checkWinner();
  if (result) {
    handleGameOver(result);
    return;
  }

  // Toggle turn
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateTurnDisplay();

  // If vs CPU and it’s now CPU’s turn, let it play
  if (isCpu && currentPlayer === cpuMark) {
    setTimeout(cpuPlay, 500);
  }
}


// عملکرد ساده CPU
function cpuPlay() {
  if (gameOver) return;

  const emptyIndices = board.map((v, i) => v === "" ? i : null).filter(i => i !== null);
  if (emptyIndices.length === 0) return;

  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  board[randomIndex] = currentPlayer;
  if (currentPlayer == "X") {
    addX(randomIndex)
  } else {
    addO(randomIndex)
  }

  const result = checkWinner();
  if (result) {
    handleGameOver(result);
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateTurnDisplay();

    if (isCpu && currentPlayer === cpuMark) {
      setTimeout(cpuPlay, 500);
    }
  }
}

// کلیک روی خانه‌ها
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => handlePlayerMove(index));
});

// دکمه ریلود و بعدی
reloadBtn.addEventListener("click", resetGame);
btnNext.addEventListener("click", resetGame);

btnQuit.addEventListener("click", () => {
  // برگشت به صفحه انتخاب یا خانه اصلی
  window.location.href = "index.html"; // مسیرت رو تنظیم کن
});
// ریست بازی
function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  cells.forEach(cell => cell.innerHTML = ""); // حذف imgها
  currentPlayer = "X";
  gameOver = false;

  if (isCpu) {
    player1.textContent = userMark === "X" ? "X (YOU)" : "X (CPU)";
    player2.textContent = userMark === "O" ? "O (YOU)" : "O (CPU)";
  } else {
    player1.textContent = `${gameData.playerOne} (X)`;
    player2.textContent = `${gameData.playerTwo} (O)`;
  }

  modal.classList.remove("d-active");
  modal.classList.add("d-none");
  updateTurnDisplay();

  if (isCpu && currentPlayer === cpuMark) {
    setTimeout(cpuPlay, 500);
  }
}


// وقتی صفحه لود شد:
window.addEventListener("DOMContentLoaded", () => {
  updateTurnDisplay();

  if (gameData.mode !== "cpu") {
    // PvP
    player1.textContent = `${gameData.playerOne} (X)`;
    player2.textContent = `${gameData.playerTwo} (O)`;
  } else {
    // PvCPU
    player1.textContent = userMark === "X" ? "X (YOU)" : "X (CPU)";
    player2.textContent = userMark === "O" ? "O (YOU)" : "O (CPU)";
  }
  // اگر بازیکن X نیست و بازی vs CPU است، اجازه بده CPU شروع کنه
  if (isCpu && currentPlayer === cpuMark) {
    setTimeout(cpuPlay, 500);
  }
});

function addX(index) {
  xIcon = document.createElement('img')
  xIcon.src = "./asset/icon-x.svg"
  cells[index].appendChild(xIcon)


}
function addO(index) {
  xIcon = document.createElement('img')
  xIcon.src = "./asset/icon-o.svg"
  cells[index].appendChild(xIcon)
}
function hoverOnEffect(index) {
  // Always block if cell filled or game over
  if (board[index] !== "" || gameOver) return;

  // Only block on the "not your turn" rule when vs CPU
  if (isCpu && currentPlayer !== userMark) return;

  board[index] = currentPlayer;
  if (currentPlayer == "X") {
    add_outline_X(index)
  } else {
    add_outline_O(index)
  }

}