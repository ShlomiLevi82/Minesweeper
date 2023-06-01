'use strict';
const _3LIVES = '🤔';
const _2LIVES = '😨';
const _1LIVES = '🥵';
const _0LIVES = '🤯';
const MINE = '💣';
let gBoard;
let gGame;
let gMines;
let gLives;
let gHints;
let gTimer;
let gTimerIntervalId;
let isHintRequested = false;
let gLevel = {
  SIZE: 4,
  MINES: 2,
};

function onInit() {
  setSmiley();
  clearInterval(gTimer);
  gTimer = 0;
  gTimerIntervalId = null;
  gLives = 3;
  gHints = 3;
  gMines = gLevel.MINES;

  gGame = {
    isOn: false,
    noShownCount: 0,
    markedCount: 0,
    secsPassed: 0,
  };
  gBoard = {
    minesAroundCount: 0,
    isShown: false,
    isMine: false,
    isMarked: false,
    i: 0,
    j: 0,
  };
  gBoard = buildBoard();
  getRandomMineLocation(gLevel);
  renderBoard(gBoard);
  console.log('gBoard', gBoard);
  document.querySelector('.mines span').innerText = gMines;
  document.querySelector('.lives span').innerText = gLives;
  document.querySelector('.hints span').innerText = gHints;
  secondsLabel.innerHTML = '00';
  minutesLabel.innerHTML = '00';
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
        i: i,
        j: j,
      };
      board[i][j] = cell;
    }
  }
  gGame.noShownCount = gLevel.SIZE * gLevel.SIZE;
  return board;
}

function renderBoard(board) {
  // console.table(board);
  let strHTML = '';

  for (let i = 0; i < board.length; i++) {
    strHTML += '<tr>';
    for (let j = 0; j < board[0].length; j++) {
      gBoard[i][j].minesAroundCount = setMinesNegsCount(gBoard, i, j);
      const currCell = gBoard[i][j];
      let currCellValue = '';
      let addClass;
      if (!currCell.isShown) {
        addClass = 'covered';
      } else if (currCell.isMine && currCell.isShown) {
        currCellValue = MINE;
        addClass = '';
      } else {
        currCellValue = currCell.minesAroundCount;
      }
      if (gBoard[i][j].isMarked) {
        addClass = '';
        currCellValue = '🚩';
      }
      var cellClass = getClassName({ i: i, j: j });
      strHTML += `<td class="cell ${cellClass} ${addClass} "
      oncontextmenu="onCellMarked(event, this ,${i},${j})"               
      onclick="onCellClicked(${i},${j},this)"
      data-i="${i}" data-j="${j}">
      ${currCellValue}
      </td>`;
    }
    strHTML += '</tr>';
  }
  // console.log('gGame', gGame);
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
  if (isHintRequested) {
    console.log('isHintRequested', isHintRequested);

    isHintRequested = false;
    hint(gBoard, i, j);

    return;
  }
  renderCell(i, j, elCell);

  if (!gGame.isOn) {
    gTimer = setInterval(setTime, 1000);
  }

  if (gBoard[i][j].isMine && !gGame.isOn) {
    gBoard[i][j].isMine = false;
    getRandomMineLocation(gLevel);
    renderBoard(gBoard);
  }
  if (gBoard[i][j].isMine && gGame.isOn) {
    elCell.style.backgroundColor = 'crimson';
    elCell.innerHTML = MINE;
    gLives--;
    gMines--;
    document.querySelector('.lives span').innerText = gLives;
  }
  if (!gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
    elCell.innerText = gBoard[i][j].minesAroundCount;

    expandShown(i, j);
  }

  gGame.isOn = true;
  checkGameOver();
  setSmiley();
}

function renderCell(i, j, elCell) {
  gBoard[i][j].isShown = true;
  elCell.classList.remove('covered');
  elCell.innerText = gBoard[i][j].minesAroundCount;
  gGame.markedCount++;
}

function expandShown(rowIdx, colIdx) {
  gBoard[rowIdx][colIdx].isShown = true;
  if (gBoard[rowIdx][colIdx].minesAroundCount === 0) {
    // RECURSION
    for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
      if (i < 0 || i >= gBoard.length) continue;
      for (let j = colIdx - 1; j <= colIdx + 1; j++) {
        if (j < 0 || j >= gBoard[0].length) continue;
        if (i === rowIdx && j === colIdx) continue;
        if (gBoard[i][j].isShown || gBoard[i][j].isMarked) continue;
        gBoard[i][j].isShown = true;
        gGame.markedCount++;
        if (gBoard[i][j].minesAroundCount === 0) {
          expandShown(i, j);
        }
      }
    }
  }

  renderBoard(gBoard);
}

function onCellMarked(event, elCell, i, j) {
  event.preventDefault();
  if (!gBoard[i][j].isMarked && gMines !== 0) {
    gBoard[i][j].isMarked = true;
    // elCell.classList.remove('covered');
    elCell.innerHTML = '🚩';
    gMines--;
    gGame.markedCount++;
    checkGameOver();
  } else if (gBoard[i][j].isMarked) {
    gBoard[i][j].isMarked = false;
    elCell.classList.add('covered');
    elCell.innerHTML = '';
    gMines++;
    gGame.markedCount--;
  }
  document.querySelector('.mines span').innerText = gMines;
  renderBoard(gBoard);
}

function checkGameOver() {
  if (gLives === 0) {
    console.log('Game Over');
    document.querySelector('.modal').style.display = 'block';
  }
  if (gGame.markedCount === gGame.noShownCount) {
    if (gLives && !gMines) {
      document.querySelector('.modal').style.display = 'block';
      document.querySelector('.modal h2').innerText = '😎 Win 😎';
      clearInterval(gTimer);
    }
  }

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
  document.querySelector('.modal').style.display = 'none';
}

function onLevel(size, mines) {
  gLevel.SIZE = size;
  gLevel.MINES = mines;
  onInit();
}

function onHint() {
  if (!gGame.isOn || gHints === 0) return;

  isHintRequested = true;
  let elHint = document.querySelector('.hints');
  elHint.style.backgroundColor = 'rgb(156, 199, 54)';
  gHints--;
  document.querySelector('.hints span').innerText = gHints;
  // NOT WORKING...(yet)
}

function hintDon(elHint) {
  elHint.style.backgroundColor = 'rgba(156, 199, 54,0)';

  //TODO:...
}

function setSmiley() {
  document.querySelector('.reset').innerHTML = _3LIVES;

  switch (gLives) {
    case 3:
      document.querySelector('.reset').innerHTML = _3LIVES;
      break;
    case 2:
      document.querySelector('.reset').innerHTML = _2LIVES;
      break;
    case 1:
      document.querySelector('.reset').innerHTML = _1LIVES;
      break;
    case 0:
      document.querySelector('.reset').innerHTML = _0LIVES;
      break;
  }
}

function hint(board, rowIdx, colIdx) {
  // console.log('rowIdx', rowIdx);
  // console.log('colIdx', colIdx);
  for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > board.length - 1) continue;
    for (let j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > board[0].length - 1) continue;
      let cell = board[i][j];

      showCell(cell.i, cell.j);
    }
  }
}

function showCell(i, j, value = 'covered') {
  // console.log('i', i);
  // console.log('j', j);
  let location = { i: i, j: j };
  // console.log('location', location);
  let cellClass = getClassName(location);
  // console.log('cellClass', cellClass);
  let elCell = document.querySelector(`.${cellClass}`);
  // console.log('elCell', elCell);

  elCell.classList.remove(value);
  elCell.innerText = gBoard[i][j].minesAroundCount;
  if (gBoard[i][j].isMine) {
    console.log('gBoard[i][j].isMine', gBoard[i][j].isMine);
    console.log('elCell', elCell);
    elCell.innerText = '💣';
  }
  setTimeout(hideCell, 1000, i, j);
}

function hideCell(i, j, value = 'covered') {
  let location = { i: i, j: j };
  let cellClass = getClassName(location);
  let elCell = document.querySelector(`.${cellClass}`);
  let elHint = document.querySelector('.hints');

  elHint.style.backgroundColor = 'rgba(156, 199, 54,0)';
  elCell.classList.add(value);
  elCell.innerText = '';
}
