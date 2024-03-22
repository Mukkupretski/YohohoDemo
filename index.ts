//#region Imports

import { socket } from "./socket";
import isInInput from "./isInInput";
import { ServerToClientEvent, ClientToServerEvents } from "./Utils/eventtypes";
import { OtherPlayer, OwnPlayer } from "./Utils/playerclasses";
import { Skins, Swords } from "./Utils/enums";

//#endregion

//#region initializing canvas

const canvas: HTMLCanvasElement = document.querySelector("canvas")!;
const game = canvas.getContext("2d")!;

canvas.width = window.innerWidth;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = 0.9 * window.innerHeight;
});

function clearCanvas() {
  game.clearRect(0, 0, canvas.width, canvas.height);
}

//#endregion

//#region Game rendering

//#region initializing players

const ownPlayer: OwnPlayer = new OwnPlayer(
  0,
  0,
  Skins.AMOGUS,
  Swords.PYTHAGORAS
);

let otherPlayers: OtherPlayer[] = [];

//#endregion

//#region Drawing canvas

function renderGame() {
  clearCanvas();
  ownPlayer.update(game, {
    ...keys,
    spacebarhold: keys.spacebardown
      ? new Date().getTime() - keys.spacebardown
      : 0,
  });
  keys.spacebartime = 0;
  socket.emit("playerChange", ownPlayer);
  otherPlayers.forEach((p) => p.update(ownPlayer, game));
  requestAnimationFrame(renderGame);
}

//#endregion

//#region Player movement

const keys: {
  w: boolean;
  d: boolean;
  s: boolean;
  a: boolean;
  spacebardown?: number;
  spacebartime: number;
} = { w: false, d: false, s: false, a: false, spacebartime: 0 };

window.addEventListener("keydown", (e) => {
  if (isInInput()) return;
  switch (e.key) {
    case "a":
      keys.a = true;
      break;

    case "d":
      keys.d = true;
      break;

    case "w":
      keys.w = true;
      break;

    case "s":
      keys.s = true;
      break;
    case " ":
      if (!ownPlayer.isAttacking && ownPlayer.dashAcc == 0) {
        keys.spacebardown = new Date().getTime();
      }
  }
});

window.addEventListener("keyup", (e) => {
  if (isInInput()) return;
  switch (e.key) {
    case "a":
      keys.a = false;
      break;

    case "d":
      keys.d = false;
      break;

    case "w":
      keys.w = false;
      break;

    case "s":
      keys.s = false;
      break;
    case " ":
      if (
        !ownPlayer.isAttacking &&
        ownPlayer.dashAcc == 0 &&
        keys.spacebardown
      ) {
        keys.spacebartime = new Date().getTime() - keys.spacebardown;
        keys.spacebardown = undefined;
      }
  }
});

//#endregion

//#region Socket events

socket.on("connect", () => {
  socket.emit("playerJoined", ownPlayer);
  renderGame();
});
socket.on("mapInit", (otherPlayers) => {
  otherPlayers = otherPlayers;
});

socket.on("playerJoined", (otherPlayer) => {
  otherPlayers.push(otherPlayer);
});

socket.on("playerChange", (otherPlayer) => {
  otherPlayers.find((p) => p.id === otherPlayer.id)?.setProperties(otherPlayer);
});

socket.on("playerLeft", (id) => {
  otherPlayers = otherPlayers.filter((p) => p.id !== id);
});
socket.on("disconnect", () => {
  socket.emit("playerLeft");
});

//#endregion
