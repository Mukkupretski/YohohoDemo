export type SerializedThing = {
  x: number;
  y: number;
  rotation: number;
};
export interface SerializedPlayer {
  width: number;
  height: number;
  rotation: number;
  x: number;
  y: number;
  size: number;
  name: string;
  health: number;
  skin: Skins;
  sword: SerializedSword;
}
export interface SerializedSword {
  angle: number;
  swordopacity: number;
  swordskin: Swords;
  swordwidth: number;
  swordheigh: number;
}
export interface SerializedOtherPlayer extends SerializedPlayer {
  id: string;
}
