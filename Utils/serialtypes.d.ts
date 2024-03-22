export type SerializedThing = {
  x: number;
  y: number;
  rotation: number;
};
export interface SerializedPlayer {
  rotation: number;
  x: number;
  y: number;
  size: number;
  name: string;
  health: number;
  skin: Skins;
  swordskin: Swords;
  swordopacity: number;
}
export interface SerializedOtherPlayer extends SerializedPlayer {
  id: string;
}
