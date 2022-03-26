import * as model from "./model.js";

class View {
  _colorsSection = document.querySelector(".existing-colors");
  _BoardSection = document.querySelector(".board");
  _RestartButton = document.querySelector(".btn--restart");
  _CheckButton = document.querySelector(".btn--check");
  _hiddenColors = document.querySelector(".hidden-colors");
  _labelTimer = document.querySelector(".time");
  _coverHiddenColors = document.querySelector(".hide-holes");
  _score = document.querySelector(".score");
  _win = document.querySelector(".win");
  _gameover = document.querySelector(".gameover");

  addHandlerRestart(handler) {
    window.addEventListener("load", handler);
    this._RestartButton.addEventListener("click", handler);
  }

  addHandlerColors(handler) {
    this._colorsSection.addEventListener("click", function (e) {
      const color = e.target.closest(".color");
      if (!color) return;
      handler(color.dataset.color);
    });
  }

  addHandlerHoles(handler) {
    this._BoardSection.addEventListener("click", function (e) {
      const currentLine = model.state.currentLine;
      const selectColor = model.state.selectColor;

      const line = e.target.closest(`#line${currentLine}`);
      if (!line) return;

      const hole = e.target.closest(".hole");
      if (!hole) return;

      hole.className = "hole";
      hole.classList.add(`hole--${selectColor}`);

      handler(hole.dataset.hole);
    });
  }

  addHandlerCheck(handler) {
    this._CheckButton.addEventListener("click", handler);
  }

  highlightSelectColor(selectColor) {
    document
      .querySelectorAll(".color")
      .forEach((el) => el.classList.remove("active"));

    document.querySelector(`#${selectColor}`).classList.add("active");
  }

  renderHiddenColors(colors) {
    const holes = this._hiddenColors.querySelectorAll(".hole");
    holes.forEach((hole) => (hole.className = "hole"));
    holes.forEach((hole, i) => hole.classList.add(`hole--${colors[i]}`));
  }

  renderPoints(state) {
    const whitePointsLine = document.querySelector(
      `#white-points-line-${state.currentLine}`
    );
    const redPointsLine = document.querySelector(
      `#red-points-line-${state.currentLine}`
    );

    const translations = [0, 1.64, 3.08, 4.54, 6.02];

    if (!whitePointsLine || !redPointsLine) return;

    whitePointsLine.style.transform = `translateX(-${
      translations[state.numWhitePoints]
    }rem)`;
    redPointsLine.style.transform = `translateX(${
      translations[state.numRedPoints]
    }rem)`;
  }

  highlightCurrentline(currentLine) {
    document
      .querySelectorAll(".line")
      .forEach((el) => el.classList.remove("line-active"));

    document.querySelector(`#line${currentLine}`).classList.add("line-active");
  }

  clearBoard() {
    document.querySelectorAll(".hole").forEach((el) => (el.className = "hole"));
  }
  clearPoints() {
    document.querySelectorAll(".points-line").forEach((el) => {
      el.style.transform = "";
    });
  }

  renderTime(min, sec) {
    this._labelTimer.textContent = `${min}:${sec}`;
  }

  revealHiddenColors(reveal) {
    this._coverHiddenColors.style.animation = reveal
      ? "translate 3s forwards ease-in"
      : "";
  }

  renderScore(score) {
    this._score.textContent = `Score: ${score}`;
  }

  _generateBestScores(score) {
    return `
    <p>${score}</p>
      `;
  }

  renderWin(render, score = 0, savedScores = []) {
    render
      ? this._win.classList.remove("hidden")
      : this._win.classList.add("hidden");

    if (render) {
      let markupParts = [];
      markupParts.push(`
        <h1>Congratulations</h1>
        <h3>You win!</h3>
        <p class="win-score">Your score is ${score}</p>
        <h4>Best Scores</h4>  
        <div class="best-scores">
                  
    `);

      markupParts.push(savedScores.map(this._generateBestScores).join(""));

      markupParts.push("</div>");

      const markup = markupParts.reduce(
        (previousValue, currentValue) => previousValue + currentValue
      );
      this._win.innerHTML = "";
      this._win.insertAdjacentHTML("afterbegin", markup);
    }
  }

  renderGameOver(render) {
    render
      ? this._gameover.classList.remove("hidden")
      : this._gameover.classList.add("hidden");
  }
}

export default new View();
