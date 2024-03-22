//#region Imports

import { socket } from "./socket";
import isInInput from "./isInInput";
import { ServerToClientEvent, ClientToServerEvents } from "./Utils/eventtypes";
import { OwnPlayer } from "./Utils/playerclasses";
import { Skins } from "./Utils/enums";

//#endregion

//#region initializing canvas

const canvas: HTMLCanvasElement = document.querySelector("canvas")!;
const game = canvas.getContext("2d")!;

canvas.width = window.innerWidth;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = 0.9 * window.innerHeight;
});

//#endregion

//#region Game rendering

//#region initializing player

const ownPlayer: OwnPlayer = new OwnPlayer(0, 0, Skins.AMOGUS, Swords);

function renderGame() {
  clearCanvas();

  requestAnimationFrame(renderGame);
}

//#endregion

//#region Player movement

const keys: {
  w: boolean;
  d: boolean;
  s: boolean;
  a: boolean;
  spacebartime: number;
} = { w: false, d: false, s: false, a: false, spacebartime: 0 };

window.addEventListener("keydown", (e) => {
  if (isInInput()) return;
  switch (e.key) {
    case "a":
      break;

    case "d":
      break;

    case "w":
      break;

    case "s":
      break;
  }
});

//#endregion

renderGame();

function clearCanvas() {
  game.clearRect(0, 0, canvas.width, canvas.height);
}
