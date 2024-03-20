//#region Imports

import { Socket, io } from "socket.io-client";
import {
  ServerToClientEvent,
  ClientToServerEvents,
  Player,
  OtherPlayer,
} from "./Types/eventtypes";

//#endregion

//#region Preventing movement during text input editing

const name: HTMLInputElement = document.querySelector("#name")!;

let focused = false;

document
  .querySelectorAll<HTMLInputElement>('input[type="text"]')
  .forEach((el) => {
    el.addEventListener("focusin", () => {
      focused = true;
    });
    el.addEventListener("focusout", () => {
      focused = false;
    });
  });

//#endregion

//#region Initializing player

let player: Player = { name: "", x: 0, y: 0, health: 100, size: 1 };
let otherPlayers: OtherPlayer[] = [];

name.addEventListener("change", () => {
  name.blur();
  player.name = name.value;
  socket.emit("playerChange", player);
});

//#endregion

//#region Choosing connection from devtunnel (port forward) and localhost

const connect: HTMLInputElement = document.querySelector("#connect")!;

if (localStorage.getItem("connection") == "http://localhost:3000") {
  connect.checked = true;
} else if (localStorage.getItem("connetion") == null) {
  localStorage.setItem(
    "connection",
    "https://w8b2j173-3000.euw.devtunnels.ms/"
  );
}

function changeServer(e: Event) {
  localStorage.setItem(
    "connection",
    connect.checked
      ? "http://localhost:3000"
      : "https://w8b2j173-3000.euw.devtunnels.ms/"
  );
  connect.removeEventListener("change", changeServer);
  window.location.reload();
}

connect.addEventListener("change", changeServer);

//#endregion

//#region Connecting

const connectionstring = localStorage.getItem("connection") as string;

const socket: Socket<ServerToClientEvent, ClientToServerEvents> =
  io(connectionstring);

//#endregion

//#region Socket events

socket.on("playerChange", (otherPlayer) => {
  const index = otherPlayers.findIndex((elem) => elem.id === otherPlayer.id);
  if (index === -1) {
    otherPlayers.push(otherPlayer);
    return;
  }
  otherPlayers[index] = otherPlayer;
});

socket.on("playerLeft", (id) => {
  otherPlayers = otherPlayers.filter((elem) => {
    return elem.id != id;
  });
});

//#endregion

//#region initializing canvas

const canvas: HTMLCanvasElement = document.querySelector("canvas")!;
const game = canvas.getContext("2d")!;

canvas.width = window.innerWidth;
canvas.height = 0.9 * window.innerHeight;

game.fillStyle = "gray";
game.font = "16px Arial";
game.fillRect(0, 0, 100, 100);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = 0.9 * window.innerHeight;
  game.fillStyle = "gray";
  game.font = "16px Arial";
});

//#endregion

//#region Game rendering

function drawPlayer() {
  game.fillRect(player.x, player.y, 100, 100);
  game.fillText(player.name, player.x, player.y);
}

function clearCanvas() {
  game.clearRect(0, 0, canvas.width, canvas.height);
}

function renderOtherPlayers() {
  otherPlayers.forEach((p) => {
    game.fillRect(p.x, p.y, 100, 100);
    game.fillText(p.name, p.x, p.y);
  });
}

function renderGame() {
  clearCanvas();
  drawPlayer();
  renderOtherPlayers();
  socket.emit("playerChange", player);
  requestAnimationFrame(renderGame);
}

//#endregion

//#region Player movement

window.addEventListener("keydown", (e) => {
  if (focused) return;
  switch (e.key) {
    case "a":
      if (player.x > 0) {
        player.x -= 10;
      }
      break;

    case "d":
      if (player.x < canvas.width - 100) {
        player.x += 10;
      }
      break;

    case "w":
      if (player.y > 0) {
        player.y -= 10;
      }
      break;

    case "s":
      if (player.y < canvas.height - 100) {
        player.y += 10;
      }
      break;
  }
});

//#endregion

renderGame();
