'use strict';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
  //The maximum is inclusive and the minimum is inclusive
}

//  <label id="minutes">00</label>:<label id="seconds">00</label>

let minutesLabel = document.getElementById('minutes');
let secondsLabel = document.getElementById('seconds');
let totalSeconds = 0;

function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
  let valString = val + '';
  if (valString.length < 2) {
    return '0' + valString;
  } else {
    return valString;
  }
}

function getClassName(location) {
  const cellClass = `cell-${location.i}-${location.j}`;
  return cellClass;
}
