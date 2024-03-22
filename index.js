"use strict";
//#region Imports
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = require("./socket");
const isInInput_1 = __importDefault(require("./isInInput"));
const playerclasses_1 = require("./Utils/playerclasses");
const enums_1 = require("./Utils/enums");
//#endregion
//#region initializing canvas
const canvas = document.querySelector("canvas");
const game = canvas.getContext("2d");
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
const ownPlayer = new playerclasses_1.OwnPlayer(0, 0, enums_1.Skins.AMOGUS, enums_1.Swords.PYTHAGORAS);
let otherPlayers = [];
//#endregion
//#region Drawing canvas
function renderGame() {
    clearCanvas();
    ownPlayer.update(game, Object.assign(Object.assign({}, keys), { spacebarhold: keys.spacebardown
            ? new Date().getTime() - keys.spacebardown
            : 0 }));
    keys.spacebartime = 0;
    socket_1.socket.emit("playerChange", ownPlayer);
    otherPlayers.forEach((p) => p.update(ownPlayer, game));
    requestAnimationFrame(renderGame);
}
//#endregion
//#region Player movement
const keys = { w: false, d: false, s: false, a: false, spacebartime: 0 };
window.addEventListener("keydown", (e) => {
    if ((0, isInInput_1.default)())
        return;
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
    if ((0, isInInput_1.default)())
        return;
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
            if (!ownPlayer.isAttacking &&
                ownPlayer.dashAcc == 0 &&
                keys.spacebardown) {
                keys.spacebartime = new Date().getTime() - keys.spacebardown;
                keys.spacebardown = undefined;
            }
    }
});
//#endregion
//#region Socket events
socket_1.socket.on("connect", () => {
    socket_1.socket.emit("playerJoined", ownPlayer);
    renderGame();
});
socket_1.socket.on("mapInit", (otherPlayers) => {
    otherPlayers = otherPlayers;
});
socket_1.socket.on("playerJoined", (otherPlayer) => {
    otherPlayers.push(otherPlayer);
});
socket_1.socket.on("playerChange", (otherPlayer) => {
    var _a;
    (_a = otherPlayers.find((p) => p.id === otherPlayer.id)) === null || _a === void 0 ? void 0 : _a.setProperties(otherPlayer);
});
socket_1.socket.on("playerLeft", (id) => {
    otherPlayers = otherPlayers.filter((p) => p.id !== id);
});
socket_1.socket.on("disconnect", () => {
    socket_1.socket.emit("playerLeft");
});
//#endregion
