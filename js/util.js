'use strict';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
  //The maximum is inclusive and the minimum is inclusive
}

function renderTimer() {
  let elTimer = document.querySelector('.timer');

  let stopWatch = +gTimer.toFixed(2);
  elTimer.innerText = stopWatch;
}

function startTimer() {
  gTimerIntervalId = setInterval(() => {
    gTimer += 0.01;
    renderTimer();
  }, 10);
}
