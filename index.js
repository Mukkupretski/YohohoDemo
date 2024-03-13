"use strict";
//Imports
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_client_1 = require("socket.io-client");
//Preventing movement during text input editing
var name = document.querySelector("#name");
var focused = false;
document
    .querySelectorAll('input[type="text"]')
    .forEach(function (el) {
    el.addEventListener("focusin", function () {
        focused = true;
    });
    el.addEventListener("focusout", function () {
        focused = false;
    });
});
//Initializing player
var player = { name: "", x: 0, y: 0, health: 100, size: 1 };
var otherPlayers = [];
name.addEventListener("change", function () {
    name.blur();
    player.name = name.value;
    socket.emit("playerChange", player);
});
//Choosing connection from devtunnel (port forward) and localhost
var connect = document.querySelector("#connect");
if (localStorage.getItem("connection") == "http://localhost:3000") {
    connect.checked = true;
}
else if (localStorage.getItem("connetion") == null) {
    localStorage.setItem("connection", "https://w8b2j173-3000.euw.devtunnels.ms/");
}
function changeServer(e) {
    localStorage.setItem("connection", connect.checked
        ? "http://localhost:3000"
        : "https://w8b2j173-3000.euw.devtunnels.ms/");
    connect.removeEventListener("change", changeServer);
    window.location.reload();
}
connect.addEventListener("change", changeServer);
//Connecting
var connectionstring = localStorage.getItem("connection");
var socket = (0, socket_io_client_1.io)(connectionstring);
//Socket events
socket.on("playerChange", function (otherPlayer) {
    var index = otherPlayers.findIndex(function (elem) { return elem.id === otherPlayer.id; });
    if (index === -1) {
        otherPlayers.push(otherPlayer);
        return;
    }
    otherPlayers[index] = otherPlayer;
});
socket.on("playerLeft", function (id) {
    otherPlayers = otherPlayers.filter(function (elem) {
        return elem.id != id;
    });
});
//initializing canvas
var canvas = document.querySelector("canvas");
var game = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = 0.9 * window.innerHeight;
game.fillStyle = "gray";
game.font = "16px Arial";
game.fillRect(0, 0, 100, 100);
window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = 0.9 * window.innerHeight;
});
//Game rendering
function drawPlayer() {
    game.fillRect(player.x, player.y, 100, 100);
    game.fillText(player.name, player.x, player.y);
}
function clearCanvas() {
    game.clearRect(0, 0, canvas.width, canvas.height);
}
function renderOtherPlayers() {
    otherPlayers.forEach(function (p) {
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
//Player movement
window.addEventListener("keydown", function (e) {
    if (focused)
        return;
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
//Renders game
renderGame();
