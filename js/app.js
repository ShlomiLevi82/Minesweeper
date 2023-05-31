'use strict';

const MINE = '💣';

let gBoard;
let gLevel;
let gGame;
let gCount;

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

      if ((i === 1 && j === 1) || (i === 2 && j === 2)) {
        cell.isMine = true;
      }
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
      //   let currCellValue = currCell.isMine ? '*' : '';
      let currCellValue = '';

      strHTML += `<td class="cell covered"
            onclick="onCellClicked(${i},${j},this)"
            data-i="${i}" data-j="${j}">
             ${currCellValue}
            </td>`;
    }
    strHTML += '</tr>';
  }
  const elBoard = document.querySelector('.board');
  elBoard.innerHTML = strHTML;
  //   getRandomMineLocation(gLevel);
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
  if (gBoard[i][j].isMine) {
    elCell.style.backgroundColor = 'crimson';
    elCell.innerHTML = MINE;
  }
  if (!gBoard[i][j].isMine) {
    elCell.innerHTML = setMinesNegsCount(gBoard, i, j);
    elCell.style.backgroundColor = 'white';
  }
}

function onCellMarked(elCell) {
  //     alled when a cell is right clicked
  // See how you can hide the context
  // menu on right click
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
  //   let mines = [];
  for (let i = 0; i < gLevel.MINES; i++) {
    // let iCell = getRandomInt(0, gLevel.SIZE);
    // let jCell = getRandomInt(0, gLevel.SIZE);
    // let mine = { iCell, jCell };
    // mines.push(mine);
    gBoard[getRandomInt(0, gLevel.SIZE)][
      getRandomInt(0, gLevel.SIZE)
    ].isMine = true;
  }
  //   console.log('mines', mines);
  //   return mines;
}
