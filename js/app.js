'use strict';

const MINE = '💣';
let gTimer = 0;
let gBoard;
let gLevel;
let gGame;
let gCount;
let gTimerIntervalId;
function onInit() {
  gLevel = {
    SIZE: 4,
    MINES: 2,
  };
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
  renderBoard(gBoard);
  console.log('gBoard', gBoard);
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

      let addClass = !currCell.isShown ? 'covered' : '';
      //   let currCellValue = currCell.isMine ? '*' : '';
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
  getRandomMineLocation(gLevel);
}

function setMinesNegsCount(board, rowIdx, colIdx) {
  gCount = 0;

  for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > board.length - 1) continue;
    for (let j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > board[0].length - 1) continue;
      if (i === rowIdx && j === colIdx) continue;
      let currCell = board[i][j];
      if (currCell.isMine) {
        gCount++;
      }
    }
  }
  console.log('gCount', gCount);
  return gCount;
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
    clearInterval(gTimerIntervalId);
  }
  if (!gBoard[i][j].isMine) {
    elCell.innerHTML = setMinesNegsCount(gBoard, i, j);
    elCell.style.backgroundColor = 'white';
    gBoard[i][j].isShown = true;
  }
  gGame.isOn = true;
  startTimer();
}

function onCellMarked(event, i, j, elCell) {
  event.preventDefault();
  console.log('event');
  elCell.innerHTML = '🚩';
}

function checkGameOver() {
  //     Game ends when all mines are
  // marked, and all the other cells
  // are shown
}

function expandShown(board, elCell, i, j) {
  //     When user clicks a cell with no
  // mines around, we need to open
  // not only that cell, but also its
  // neighbors.
  // NOTE: start with a basic
  // implementation that only opens
  // the non-mine 1st degree
  // neighbors
  // BONUS: if you have the time
  // later, try to work more like the
  // real algorithm (see description
  // at the Bonuses section below)
}

function getRandomMineLocation(gLevel) {
  for (let i = 0; i < gLevel.MINES; i++) {
    gBoard[getRandomInt(0, gLevel.SIZE)][
      getRandomInt(0, gLevel.SIZE)
    ].isMine = true;
  }
}
