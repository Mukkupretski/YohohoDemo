import { Socket, io } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "./Utils/eventtypes";
import { settings } from "./settings";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  settings.localhost
    ? "http://localhost:3000"
    : "https://w8b2j173-3000.euw.devtunnels.ms/"
);
