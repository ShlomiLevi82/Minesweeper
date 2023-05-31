'use strict';

const MINE = '💣';
let gTimer;
let gBoard;
let gLevel;
let gGame;
let gTimerIntervalId;
let gMines;
let gLives;

function onInit() {
  gTimer = 0;
  gTimerIntervalId = null;
  gLives = 3;
  gLevel = {
    SIZE: 4,
    MINES: 2,
  };
  gMines = gLevel.MINES;
  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
  };
  gBoard = {
    minesAroundCount: 0,
    isShown: false,
    isMine: false,
    isMarked: false,
  };
  gBoard = buildBoard();
  getRandomMineLocation(gLevel);
  renderBoard(gBoard);
  console.log('gBoard', gBoard);
  document.querySelector('.mines span').innerText = gMines;
  document.querySelector('.lives span').innerText = gLives;
}

function buildBoard() {
  const board = [];

  for (let i = 0; i < gLevel.SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < gLevel.SIZE; j++) {
      let cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
      board[i][j] = cell;
    }
  }
  return board;
}

function renderBoard(board) {
  console.table(board);
  let strHTML = '';

  for (let i = 0; i < board.length; i++) {
    strHTML += '<tr>';
    for (let j = 0; j < board[0].length; j++) {
      const currCell = gBoard[i][j];
      gBoard[i][j].minesAroundCount = setMinesNegsCount(gBoard, i, j);
      let addClass = !currCell.isShown ? 'covered' : '';
      let currCellValue = '';

      strHTML += `<td class="cell ${addClass}"
            oncontextmenu="onCellMarked(event, this ,${i},${j})"               
             onclick="onCellClicked(${i},${j},this)"

            data-i="${i}" data-j="${j}">
             ${currCellValue}
            </td>`;
    }
    strHTML += '</tr>';
  }
  const elBoard = document.querySelector('.board');
  elBoard.innerHTML = strHTML;
}

function setMinesNegsCount(board, rowIdx, colIdx) {
  let negsCount = 0;

  for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > board.length - 1) continue;
    for (let j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > board[0].length - 1) continue;
      if (i === rowIdx && j === colIdx) continue;
      let currCell = board[i][j];
      if (currCell.isMine) {
        negsCount++;
      }
    }
  }
  return negsCount;
}

function onCellClicked(i, j, elCell) {
  if (gBoard[i][j].isMine && !gGame.isOn) {
    gBoard[i][j].isMine = false;
    gBoard[i][j].isShown = true;
    // renderBoard(gBoard);
  }
  if (gBoard[i][j].isMine && gGame.isOn) {
    elCell.style.backgroundColor = 'crimson';
    elCell.innerHTML = MINE;
    gBoard[i][j].isShown = true;
    gLives--;
    gMines--;
    document.querySelector('.lives span').innerText = gLives;
    checkGameOver();
  }
  if (!gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
    gBoard[i][j].minesAroundCount = setMinesNegsCount(gBoard, i, j);
    elCell.innerText = gBoard[i][j].minesAroundCount;
    elCell.classList.remove('.covered');
    expandShown(gBoard, elCell, i, j);
    if (gBoard[i][j].isShown) elCell.classList.remove('.covered');
  }
  gGame.isOn = true;
  startTimer();
}
function expandShown(board, elCell, rowIdx, colIdx) {
  for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > board.length - 1) continue;
    for (let j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > board[0].length - 1) continue;
      if (i === rowIdx && j === colIdx) continue;
      let cell = gBoard[i][j];
      if (!cell.isMine && !setMinesNegsCount(board, rowIdx, colIdx)) {
        let pos = { i, j };
        console.log('pos:', pos);
        if (!cell.minesAroundCount) {
          gBoard[i][j].isShown = true;
          elCell.classList.remove('.covered');
          renderBoard(board);
        }
      }
    }
  }
}

function onCellMarked(event, elCell, i, j) {
  event.preventDefault();
  if (!gBoard[i][j].isMarked && gMines !== 0) {
    elCell.innerHTML = '🚩';
    gBoard[i][j].isMarked = true;
    gMines--;
  } else if (gBoard[i][j].isMarked) {
    elCell.innerHTML = '';
    gBoard[i][j].isMarked = false;
    gMines++;
  }

  //   let flag = gBoard[i][j].isMarked ? '' : '🚩';
  //   elCell.innerHTML = flag;
  //   if ((elCell.innerHTML = flag)) {
  //     gBoard[i][j].isMarked = true;
  //   } else {
  //     gBoard[i][j].isMarked = false;
  //   }
  document.querySelector('.mines span').innerText = gMines;
}

function checkGameOver() {
  clearInterval(gTimerIntervalId);
}

function getRandomMineLocation(gLevel) {
  for (let i = 0; i < gLevel.MINES; i++) {
    gBoard[getRandomInt(0, gLevel.SIZE)][
      getRandomInt(0, gLevel.SIZE)
    ].isMine = true;
  }
}

function onReset() {
  onInit();
  clearInterval(gTimerIntervalId);
}
