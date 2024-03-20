import { Swords } from "./enums";
import { OwnPlayer, Player } from "./playerclasses";

export type Obj = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export class Sword {
  skin: Swords;
  owner: Player;
  handimg: CanvasImageSource | undefined;
  swordimg: CanvasImageSource | undefined;
  angle: number;
  direction: "static" | "left" | "right";
  hand: Obj;
  sword: Obj;
  constructor(skin: Swords, owner: Player) {
    this.hand = this.getHand();
    this.sword = this.getSword();
    this.angle = 30;
    this.direction = "static";
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
  getHand(): Obj {
    return {
      width: 64,
      height: 64,
      x: this.owner.x - this.owner.width / 2,
      y: this.owner.y,
    };
  }
  getSword(): Obj {
    return {
      width: 256,
      height: 64,
      x: this.owner.x - this.owner.width / 2 - 128,
      y: this.owner.y,
    };
  }
  swing() {
    switch (this.angle) {
      case 30:
        this.direction = "right";
      case 150:
        this.direction = "left";
    }
  }
  draw(player: OwnPlayer, context: CanvasRenderingContext2D) {
    context.rotate(this.angle);
    context.translate;
  }
  update(player: OwnPlayer, context: CanvasRenderingContext2D) {
    if (this.direction !== "static") {
      if (this.angle >= 150) {
        this.direction = "static";
        this.angle = 150;
      } else if (this.angle <= 30) {
        this.direction = "static";
        this.angle = 30;
      } else {
        this.angle += (this.direction === "right" ? 1 : -1) * 15;
      }
    }
    this.draw(player, context);
  }
}
