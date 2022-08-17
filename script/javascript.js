const colors = ["green", "red", "yellow", "blue"];

const STATUS_STANDBY = 0;
const STATUS_SIMON = 1;
const STATUS_YOU = 2;

const STATUS_CANIGETRIDOFTHISSTATUS = 3;

var gameStatus = STATUS_STANDBY;

// color sequence holder array
var simonColor = [];
var yourColor = [];

const ATTEMPT_TO_WIN_EASY = 5;
const ATTEMPT_TO_WIN_MEDIUM = 10;
const ATTEMPT_TO_WIN_HARD = 20;
let attempts_towin = ATTEMPT_TO_WIN_MEDIUM;

// improve as a listof functions
var audioGreen = new Audio("../sounds/green.mp3");
var audioRed = new Audio("../sounds/red.mp3");
var audioYellow = new Audio("../sounds/yellow.mp3");
var audioBlue = new Audio("../sounds/blue.mp3");

var wrongSequence = new Audio("../sounds/wrong.mp3");

//var soundsList = [audioGreen, audioRed, audioYellow, audioBlue];

// delay Simon key sequence
function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

// Difficulty level changed from page
function setDifficultyLevel(level) {
  debugger;

  switch (level) {
    case "0":
      attempts_towin = ATTEMPT_TO_WIN_EASY;
      break;

    case "1":
      attempts_towin = ATTEMPT_TO_WIN_MEDIUM;
      break;

    case "2":
      attempts_towin = ATTEMPT_TO_WIN_HARD;
      break;

    default:
      break;
  }
}

function highlightColor(color, pressed) {
  if (pressed) {
    switch (color) {
      case "green":
        audioGreen.play();
        break;

      case "yellow":
        audioYellow.play();
        break;

      case "red":
        audioRed.play();
        break;

      case "blue":
        audioBlue.play();
        break;

      default:
        break;
    }
    document.getElementById(color).classList.add("pressed");
  } else document.getElementById(color).classList.remove("pressed");
}

//either of  Simon and you
async function colorClicked(color) {
  // click is valid if user turn
  if (gameStatus === STATUS_YOU) {
    highlightColor(color, true);
    yourColor.push(color);
    setTimeout(highlightColor, 250, color, false);

    let fine = true;

    // check each and every colour : if wrong stop the game
    if (yourColor[yourColor.length - 1] !== simonColor[yourColor.length - 1]) {
      gameStatus = STATUS_CANIGETRIDOFTHISSTATUS;
      fine = false;

      startTheGame();
    }

    if (simonColor.length === yourColor.length) {
      // if here whole sequence is correct

      // Simon's turn again
      if (fine) {
        gameStatus = STATUS_SIMON;

        await delay(1500);
        startTheGame();
      }
    }
  }
}

// add a random color in Simon's list
async function simonAddColor() {
  simonColor.push(colors[Math.floor(Math.random() * 4)]);
  debugger;
  document.getElementById("colors-guessed").innerHTML =
    simonColor.length + (" out of " + attempts_towin);

  await playSimonList();
}

// play Simon's list
async function playSimonList() {
  for (var i = 0; i < simonColor.length; i++) {
    highlightColor(simonColor[i], true);
    setTimeout(highlightColor, 150, simonColor[i], false);
    await delay(1000);
  }
}

// both from user or app
async function startTheGame(button) {
  if (gameStatus === STATUS_STANDBY) {
    document.getElementById("start-game").style.visibility = "hidden";
    document.getElementById("difficulty_div").style.visibility = "hidden";

    // sequence init
    simonColor = [];
    yourColor = [];

    // Simon's turn
    gameStatus = STATUS_SIMON;
  }

  if (gameStatus === STATUS_SIMON) {
    if (simonColor.length === attempts_towin) {
      // same code as below make a function :
      document.getElementById("level-title").innerHTML = "You win";
      document.getElementById("start-game").style.visibility = "visible";
      document.getElementById("start-game").innerText = "challange Simon again";
      document.getElementById("difficulty_div").style.visibility = "visible";

      gameStatus = STATUS_STANDBY;
    } else {
      // Simon's turn
      document.getElementById("level-title").innerHTML = "Simon' turn";
      await delay(1000);

      // play previous if any and add a new color
      await simonAddColor(); // wait till sequence end

      // then
      // user sequence from 0 again
      yourColor = [];
      await delay(500);

      document.getElementById("level-title").innerHTML = "Your turn";
      gameStatus = STATUS_YOU;
    }
  } else if (gameStatus === STATUS_CANIGETRIDOFTHISSTATUS) {
    wrongSequence.play();
    document.getElementById("level-title").innerHTML = "Simon wins";
    await delay(1000);

    // you lost enable Press to Start button again
    document.getElementById("start-game").style.visibility = "visible";
    document.getElementById("start-game").innerText = "challange Simon again";
    document.getElementById("difficulty_div").style.visibility = "visible";

    gameStatus = STATUS_STANDBY;
  }
}
