import * as model from "./model.js";
import view from "./view.js";

let timerGame;
const scoreMax = 3000;

const controlRestart = function () {
  // Rest Variables
  model.state.currentHoles = ["", "", "", ""];
  model.state.hiddenColors = ["", "", "", ""];
  model.state.numWhitePoints = 0;
  model.state.numRedPoints = 0;
  model.state.currentLine = 1;
  model.state.selectColor = "red"; //selectColor is red by default

  // Remove all the panws from the board
  view.clearBoard();

  // Reset the points
  view.clearPoints();

  //Hide the secret colors
  view.revealHiddenColors(false);

  //Generate new hidden colors
  model.generateHiddenColors();
  view.renderHiddenColors(model.state.hiddenColors);

  // Highlight the current line
  view.highlightCurrentline(model.state.currentLine);

  // Highlitght the selected color
  view.highlightSelectColor(model.state.selectColor);

  // (Re)start the timer
  if (timerGame) clearInterval(timerGame);
  timerGame = startTimer();

  // Render score
  model.state.score = scoreMax;
  view.renderScore(model.state.score);

  // Hide win and game over screens
  view.renderWin(false);
  view.renderGameOver(false);
};

const controlColors = function (color) {
  model.state.selectColor = color;
  view.highlightSelectColor(model.state.selectColor);
};

const controlHoles = function (hole) {
  model.state.currentHoles[hole] = model.state.selectColor;
};

const controlCheck = function () {
  if (!model.checkIfCurrentLineFull()) return;

  model.calculatePoints();
  view.renderPoints(model.state);

  if (model.state.numRedPoints === 4) {
    model.state.currentLine = 100;

    view.revealHiddenColors(true);
    view.renderWin(true, model.state.score, model.state.savedScores);

    clearInterval(timerGame);

    model.saveScore();
  } else if (model.state.currentLine === 10) {
    model.state.currentLine = 100;

    view.revealHiddenColors(true);
    view.renderGameOver(true);

    clearInterval(timerGame);
  } else {
    model.state.currentLine++;

    if (model.state.score !== 0) model.state.score -= 100;
    if (model.state.score < 0) model.state.score = 0;

    view.highlightCurrentline(model.state.currentLine);
    model.state.currentHoles = ["", "", "", ""];
  }
};

const startTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //In each call, print the remaining time to the UI
    view.renderTime(min, sec);
    time++;

    // Update score
    if (model.state.score !== 0) model.state.score -= 1;
    if (model.state.score < 0) model.state.score = 0;
    view.renderScore(model.state.score);
  };

  //Set Time to 0s
  let time = 0;

  //Call the time every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const init = function () {
  view.addHandlerRestart(controlRestart);
  view.addHandlerCheck(controlCheck);
  view.addHandlerColors(controlColors);
  view.addHandlerHoles(controlHoles);
};
init();
