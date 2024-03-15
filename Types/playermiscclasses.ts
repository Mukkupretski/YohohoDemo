import { Swords } from "./enums";
import { Player } from "./playerclasses";

export class Sword {
  skin: Swords;
  owner: Player;
  constructor(skin: Swords, owner: Player) {
    this.skin = skin;
    this.owner = owner;
  }
}
