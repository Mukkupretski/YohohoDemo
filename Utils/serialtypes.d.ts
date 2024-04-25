import { ThingTypes, Skins, Swords } from "./enums";
import { Thing } from "./thingclasses";

export type SerializedThing = {
  x: number;
  y: number;
  rotation: number;
  thingType: ThingTypes;
  width: number;
  height: number;
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
export interface SerializedGrassPatch {
  x: number;
  y: number;
  width: number;
  height: number;
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
export interface SerializedWorldMap {
  staticForeground: SerializedThing[];
  dynamicForeground: SerializedThing[];
  grass: SerializedGrassPatch[];
  staticBackground: SerializedThing[];
  dynamicBackground: SerializedThing[];
  staticChanging: SerializedThing[];
}
export interface SerializedGame {
  id: string;
  map: SerializedWorldMap;
  players: SerializedOtherPlayer[];
}
