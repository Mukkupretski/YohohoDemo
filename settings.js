"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
const connect = document.querySelector("#connect");
function changeServer(e) {
    exports.settings.localhost = connect.checked;
    localStorage.setItem("settings", JSON.stringify(exports.settings));
    connect.removeEventListener("change", changeServer);
    window.location.reload();
}
connect.addEventListener("change", changeServer);
exports.settings = localStorage.getItem("settings")
    ? JSON.parse(localStorage.getItem("settings"))
    : { localhost: false };
