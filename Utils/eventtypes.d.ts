import {
  SerializedGame,
  SerializedItem,
  SerializedOtherPlayer,
  SerializedPlayer,
  SerializedThing,
} from "./serialtypes";

export type ServerToClientEvents = {
  playerChange: (player: SerializedOtherPlayer) => void;
  playerDamage: (damager: SerializedOtherPlayer, damage: number) => void;
  playerForce: (vector: [number, number], duration: number) => void;
  playerJoined: (player: SerializedOtherPlayer) => void;
  mapInit: (map: SerializedGame) => void;
  playerLeft: (id: string) => void;
  emote: (emoteId: number, id: string) => void;
  setItem: (player: SerializedOtherPlayer, item: SerializedItem) => void;
  mapChanged: (
    dynamicBackground: SerializedThing[],
    dynamicForeground: SerializedThing[]
  ) => void;
};
export type ClientToServerEvents = {
  playerJoined: (player: SerializedPlayer) => void;
  playerChange: (player: SerializedPlayer) => void;
  swing: (player: SerializedPlayer, type: "swing" | "dash") => void;
  dash: (
    player: SerializedPlayer,
    power: number,
    dashStart: [number, number]
  ) => void;
  emote: (emoteId: number) => void;
  playerDied: (player: SerializedPlayer) => void;
  setItem: (player: SerializedPlayer, item: SerializedItem) => void;
};
