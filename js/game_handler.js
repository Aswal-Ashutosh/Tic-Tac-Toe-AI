const board = document.getElementsByTagName("td");
const backendBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];
const ai_piece = "O";
const player_piece = "X";

function initialize() {
  for (let i = 0; i < board.length; ++i) {
    board[i].onclick = function () {
      this.innerText = backendBoard[Math.floor(i / 3)][i % 3] = player_piece;
      this.onclick = null;
      let winner = checkForWinner();
      if (winner !== null) {
        displayWinner(winner);
        return;
      }
      //AI Turn
      const move = nextBestMove();
      const row = move.i;
      const col = move.j;
      backendBoard[row][col] = ai_piece;
      board[3 * row + col].innerHTML = ai_piece;
      board[3 * row + col].onclick = null;
      winner = checkForWinner();
      if (winner !== null) {
        displayWinner(winner);
      }
    };
  }

  const restartBtn = document.getElementById("restart");
  restartBtn.onclick = restart;
}

function displayWinner(winner) {
  let winnerHeading = document.getElementsByClassName("winner")[0];
  let winnerDiv = document.getElementsByClassName("winner-section")[0];
  winnerDiv.style.display = 'block';
  if (winner !== "TIE") {
    winnerHeading.innerText = `${winner} WON!`;
  } else {
    winnerHeading.innerText = `${winner}!`;
  }
  winnerHeading.style.color = "grey";

  //Disabling further click events
  for (let i = 0; i < 9; ++i) {
    board[i].style.pointerEvents = "none";
  }
}

function checkForWinner() {
  let rows = { X: [0, 0, 0], O: [0, 0, 0] };
  let cols = { X: [0, 0, 0], O: [0, 0, 0] };
  let diaMain = { X: 0, O: 0 };
  let diaSecondary = { X: 0, O: 0 };
  let tie = true;
  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      let won = false;
      const piece = backendBoard[i][j];

      if (piece === "") {
        tie = false;
        continue;
      }

      won |= ++rows[piece][i] === 3;
      won |= ++cols[piece][j] === 3;
      if (i === j) won |= ++diaMain[piece] === 3;
      if (i + j === 2) won |= ++diaSecondary[piece] === 3;
      if (won) return piece;
    }
  }
  return tie ? "TIE" : null;
}

function nextBestMove() {
  return minimax(ai_piece).move;
}

function minimax(piece) {
  let winner = checkForWinner();
  if (winner !== null) {
    switch (winner) {
      case ai_piece:
        return { score: 1, move: null };
      case player_piece:
        return { score: -1, move: null };
      case "TIE":
        return { score: 0, move: null };
    }
  }
  const maximize = piece === ai_piece;
  let bestScore = maximize ? -Infinity : Infinity;
  let bestMove = null;
  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      if (backendBoard[i][j] !== "") continue;
      backendBoard[i][j] = piece;
      const result = minimax(piece === "X" ? "O" : "X");
      if (maximize) {
        if (result.score > bestScore) {
          bestMove = { i, j };
          bestScore = result.score;
        }
      } else {
        if (result.score < bestScore) {
          bestMove = { i, j };
          bestScore = result.score;
        }
      }
      backendBoard[i][j] = "";
    }
  }
  return { score: bestScore, move: bestMove };
}

function restart(){
  location.reload();
}

initialize();