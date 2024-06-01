import { ThingTypes, Skins, Swords, ItemTypes } from "./enums";
import { Picture } from "./othertypes";

export type SerializedThing = {
  x: number;
  y: number;
  rotation: number;
  thingType: ThingTypes;
  picture: Picture;
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
  picture: Picture;
  item?: SerializedItem;
}
export interface SerializedGrassPatch {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface SerializedItem {
  angle: number;
  opacity?: number;
  picture: Picture;
  width: number;
  height: number;
  type: ItemTypes;
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
  size: number;
}
export interface SerializedGame {
  id: string;
  map: SerializedWorldMap;
  players: SerializedOtherPlayer[];
}
