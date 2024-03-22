import { OtherPlayer, OwnPlayer, Player } from "./playerclasses";

export type ServerToClientEvent = {
  playerChange: (player: SerializedOtherPlayer) => void;
  playerDamage: (damage: number) => void;
  playerJoined: (player: SerializedOtherPlayer) => void;
  mapInit: (player: SerializedOtherPlayer[]) => void;
  playerLeft: (id: string) => void;
  test2: () => void;
};
export type ClientToServerEvents = {
  playerJoined: (player: SerializedPlayer) => void;
  playerChange: (player: SerializedPlayer) => void;
  swingSword: (player: SerializedPlayer) => void;
  dash: (player: SerializedPlayer, dashStart: [number, number]) => void;
  playerLeft: () => void;
  test: () => void;
};
