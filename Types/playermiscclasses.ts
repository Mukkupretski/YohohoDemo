import { Swords } from "./enums";
import { Player } from "./playerclasses";

export class Sword {
  skin: Swords;
  owner: Player;
  handimg: CanvasImageSource | undefined;
  swordimg: CanvasImageSource | undefined;
  angle: number;
  isSwinging: boolean;
  constructor(skin: Swords, owner: Player) {
    this.angle = 30;
    this.isSwinging = false;
    this.skin = skin;
    this.owner = owner;
    const handel = document.createElement("img");
    handel.src = "../Images/handsheet.png";
    handel.onload = () => {
      this.handimg = handel;
    };
    const swordel = document.createElement("img");
    swordel.src = "../Images/handsheet.png";
    swordel.onload = () => {
      this.swordimg = swordel;
    };
  }
  swing() {
    this.isSwinging = true;
  }
  draw() {}
  update() {}
}
