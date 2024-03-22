import { OtherPlayer, OwnPlayer, Player } from "./playerclasses";

export type ServerToClientEvent = {
  playerChange: (player: OtherPlayer) => void;
  playerDamage: (damage: number) => void;
  playerJoined: (player: OtherPlayer) => void;
  mapInit: (player: OtherPlayer[]) => void;
  playerLeft: (id: string) => void;
};
export type ClientToServerEvents = {
  playerJoined: (player: OwnPlayer) => void;
  playerChange: (player: OwnPlayer) => void;
  swingSword: (player: OwnPlayer) => void;
  dash: (player: OwnPlayer, dashStart: [number, number]) => void;
  playerLeft: () => void;
};
