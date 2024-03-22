"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket = void 0;
const socket_io_client_1 = require("socket.io-client");
const settings_1 = require("./settings");
exports.socket = (0, socket_io_client_1.io)(settings_1.settings.localhost
    ? "http://localhost:3000"
    : "https://w8b2j173-3000.euw.devtunnels.ms/");
