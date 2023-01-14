function init() {
  const playerX = "x";
  const playerO = "o";
  let turn = playerX;
  let winner = "";
  let compMadeMove = false;

  const boardState = ["", "", "", "", "", "", "", "", ""];
  const gameStatus = document.getElementById("status");
  const cells = document.querySelectorAll("[data-index]");
  const vsPlayer = document.getElementById("pvp");
  const vsComp = document.getElementById("vsai");
  let gameState = false;

  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function twoPlayers() {
    boardClear();
    gameState = false;
    gameState = true;
    turn = playerX;
    hoverMarker();
    cells.forEach((cell) => cell.addEventListener("click", placeMarker));
    hoverMarker();
    gameStatus.innerText = `It's ${turn}'s turn`;
  }

  function boardClear() {
    cells.forEach((cell) => {
      cell.innerText = "";
      cell.classList.remove("x-hover");
      cell.classList.remove("o-hover");
      cell.removeEventListener("click", placeMarker);
      cell.removeEventListener("click", userMove);
    });
    boardState.fill("");
  }

  function hoverMarker() {
    cells.forEach((cell) => {
      cell.classList.remove("x-hover");
      cell.classList.remove("o-hover");
    });
    if (!gameState) {
      return;
    }

    const hoverClass = `${turn}-hover`;

    cells.forEach((cell) => {
      if (cell.innerText == "") {
        cell.classList.add(hoverClass);
      }
    });
  }

  function turnChange() {
    turn = turn === playerX ? playerO : playerX;
  }

  function placeMarker(e) {
    if (!gameState) {
      return;
    }

    const cell = e.target;

    if (cell.innerText != "") {
      return;
    }
    const cellNumber = cell.dataset.index;

    if (turn === playerX) {
      cell.innerText = playerX;
      boardState[cellNumber - 1] = playerX;
    } else {
      cell.innerText = playerO;
      boardState[cellNumber - 1] = playerO;
    }

    checkWin();
    hoverMarker();
  }

  function checkWin() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
      const winCondition = winCombos[i];
      let a = boardState[winCondition[0]];
      let b = boardState[winCondition[1]];
      let c = boardState[winCondition[2]];
      if (a === "" || b === "" || c === "") {
        continue;
      }
      if (a === b && b === c) {
        roundWon = true;
        gameState = false;
        winner = a;
        break;
      }
    }
    if (roundWon) {
      gameStatus.innerText = `${winner} is the winner!`;
      console.log(`winner is ${winner}`);
      hoverMarker();
    }

    if (!roundWon && !boardState.includes("")) {
      gameStatus.innerText = "It's a tie!";
      gameState = false;
      hoverMarker();
    }
    if (!gameState) return;
    turnChange();
    gameStatus.innerText = `It's ${turn}'s turn`;
  }

  function vsComputer() {
    boardClear();
    gameState = false;
    gameState = true;
    turn = playerX;
    cells.forEach((cell) => cell.addEventListener("click", userMove));
    gameStatus.innerText = `It's ${turn}'s turn`;
    hoverMarker();
  }

  function compRandomMove() {
    let emptyCells = [];
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === "") {
        emptyCells.push(i);
      }
    }
    let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    let selectedCell = cells[randomIndex];
    selectedCell.innerText = playerO;
    boardState[randomIndex] = playerO;
    checkWin();
  }

  function userMove(e) {
    if (!gameState) {
      return;
    }
    const cell = e.target;
    if (cell.innerText !== "") {
      return;
    }
    cell.innerText = playerX;
    let cellIndex = cell.dataset.index;
    boardState[cellIndex - 1] = playerX;
    checkWin();
    if (!gameState) return;
    compTurn();
    hoverMarker();
  }

  function compTurn() {
    if (!gameState || !vsComputer) {
      return;
    }
    for (let i = 0; i <= 7; i++) {
      const winCondition = winCombos[i];
      let a = boardState[winCondition[0]];
      let b = boardState[winCondition[1]];
      let c = boardState[winCondition[2]];
      if (a === turn && b === turn && c === "") {
        c = turn;
        boardState[winCondition[2]] = turn;
        cells[winCondition[2]].innerText = turn;
        checkWin();
        computerMadeMove = true;
        return;
      }
      if (a === turn && b === "" && c === turn) {
        b = turn;
        boardState[winCondition[1]] = turn;
        cells[winCondition[1]].innerText = turn;
        checkWin();
        computerMadeMove = true;
        return;
      }
      if (a === "" && b === turn && c === turn) {
        a = turn;
        boardState[winCondition[0]] = turn;
        cells[winCondition[0]].innerText = turn;
        checkWin();
        computerMadeMove = true;
        return;
      }
    }
    for (let i = 0; i <= 7; i++) {
      const winCondition = winCombos[i];
      let a = boardState[winCondition[0]];
      let b = boardState[winCondition[1]];
      let c = boardState[winCondition[2]];
      if (a === playerX && b === playerX && c === "") {
        c = turn;
        boardState[winCondition[2]] = turn;
        cells[winCondition[2]].innerText = turn;
        checkWin();
        computerMadeMove = true;
        return;
      }
      if (a === playerX && b === "" && c === playerX) {
        b = turn;
        boardState[winCondition[1]] = turn;
        cells[winCondition[1]].innerText = turn;
        checkWin();
        computerMadeMove = true;
        return;
      }
      if (a === "" && b === playerX && c === playerX) {
        a = turn;
        boardState[winCondition[0]] = turn;
        cells[winCondition[0]].innerText = turn;
        checkWin();
        computerMadeMove = true;
        return;
      }
    }

    if (compMadeMove) return;
    compRandomMove();
    hoverMarker();
  }

  vsPlayer.addEventListener("click", twoPlayers);

  vsComp.addEventListener("click", vsComputer);
}

window.addEventListener("DOMContentLoaded", init);
