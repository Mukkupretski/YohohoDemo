export interface Player {
  x: number;
  y: number;
  health: number;
  size: number;
  name: string;
}
interface OtherPlayer extends Player {
  id: string;
}

export type ServerToClientEvent = {
  playerChange: (player: OtherPlayer) => void;
  playerLeft: (id) => void;
};
export type ClientToServerEvents = {
  playerChange: (player: Player) => void;
};
