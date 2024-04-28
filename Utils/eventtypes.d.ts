import { OtherPlayer, OwnPlayer, Player } from "./playerclasses";
import { SerializedOtherPlayer, SerializedPlayer } from "./serialtypes";

export type ServerToClientEvent = {
  playerChange: (player: SerializedOtherPlayer) => void;
  playerDamage: (damager: SerializedOtherPlayer, damage: number) => void;
  playerJoined: (player: SerializedOtherPlayer) => void;
  mapInit: (player: SerializedOtherPlayer[]) => void;
  playerLeft: (id: string) => void;
};
export type ClientToServerEvents = {
  playerJoined: (player: SerializedPlayer) => void;
  playerChange: (player: SerializedPlayer) => void;
  swing: (player: SerializedPlayer) => void;
  dash: (
    player: SerializedPlayer,
    power: number,
    dashStart: [number, number]
  ) => void;
};
