import { IMAGE_PATH, NO_RENDER_COLOR } from "./constants";
import { Swords } from "./enums";
import { OtherPlayer, OwnPlayer, Player } from "./playerclasses";
import { SerializedSword } from "./serialtypes";
import { Thing } from "./thingclasses";

export abstract class Weapon {
  owner: Player;
  angle: number;
  handsize: number;
  handimg: CanvasImageSource | undefined;
  constructor(owner: Player, angle: number) {
    this.angle = angle;
    this.owner = owner;
    this.handsize = 64;
    const handel = document.createElement("img");
    handel.src = `${IMAGE_PATH}/handsheet.svg`;
    handel.onload = () => {
      this.handimg = handel;
    };
  }
  abstract draw(player: OwnPlayer, context: CanvasRenderingContext2D): void;

  drawHandAndTranlate(player: OwnPlayer, context: CanvasRenderingContext2D) {
    const scale = this.owner.size / player.size;
    context.save();
    Thing.doTranslate(player, context, this.owner);
    context.rotate(((this.angle - this.owner.rotation) / 180) * Math.PI);
    context.fillStyle = NO_RENDER_COLOR;
    //Hand: center, center of player edge, size: 64px
    if (this.handimg) {
      const skinpos = [this.owner.skin % 4, Math.floor(this.owner.skin / 4)];
      context.drawImage(
        this.handimg,
        skinpos[0] * 64,
        skinpos[1] * 64,
        64,
        64,
        (-this.owner.width / 2 - this.handsize / 2) * scale,
        (-this.handsize / 2) * scale,
        this.handsize * scale,
        this.handsize * scale
      );
    } else {
      context.fillRect(
        (-this.owner.width / 2 - this.handsize / 2) * scale,
        (-this.handsize / 2) * scale,
        this.handsize * scale,
        this.handsize * scale
      );
    }
  }
}

export class Sword extends Weapon {
  swordimg: CanvasImageSource | undefined;
  swordopacity: number;
  swordskin: Swords;
  swordwidth: number;
  swordheight: number;

  constructor(
    owner: Player,
    swordskin: Swords,
    angle: number,
    swordopacity: number
  ) {
    super(owner, angle);
    this.swordheight = 64;
    this.swordwidth = 256;
    this.swordskin = swordskin;
    this.swordopacity = swordopacity;

    const swordel = document.createElement("img");
    swordel.src = `${IMAGE_PATH}/swordsheet.svg`;
    swordel.onload = () => {
      this.swordimg = swordel;
    };
  }

  draw(player: OwnPlayer, context: CanvasRenderingContext2D) {
    this.drawHandAndTranlate(player, context);
    const scale = this.owner.size / player.size;
    //Sword: handle at player's width's end, height centered to player's center
    if (this.swordimg) {
      const skinpos = [this.swordskin % 4, Math.floor(this.swordskin / 4)];
      context.drawImage(
        this.swordimg,
        skinpos[0] * 256,
        skinpos[1] * 128,
        256,
        64,
        (-this.owner.width / 2 - this.swordwidth) * scale,
        -this.swordheight * scale,
        this.swordwidth * scale,
        this.swordheight * scale
      );
      context.globalAlpha = this.swordopacity;
      context.drawImage(
        this.swordimg,
        skinpos[0] * 256,
        skinpos[1] * 128 + 64,
        256,
        64,
        (-this.owner.width / 2 - this.swordwidth) * scale,
        -this.swordheight * scale,
        this.swordwidth * scale,
        this.swordheight * scale
      );
    } else {
      context.fillRect(
        (-this.owner.width - this.swordwidth / 2) * scale,
        -this.swordheight * scale,
        this.swordwidth * scale,
        this.swordheight * scale
      );
    }
    context.restore();
  }

  serialize(): SerializedSword {
    return {
      angle: this.angle,
      swordopacity: this.swordopacity,
      swordskin: this.swordskin,
      swordwidth: this.swordwidth,
      swordheight: this.swordheight,
    };
  }
  setSword(sword: SerializedSword): void {
    this.angle = sword.angle;
    this.swordopacity = sword.swordopacity;
    this.swordskin = sword.swordskin;
  }
}

export class OwnSword extends Sword {
  direction: "static" | "left" | "right";

  constructor(owner: OwnPlayer, swordskin: Swords) {
    super(owner, swordskin, 30, 0);
    this.direction = "static";
  }

  reset(): void {
    this.angle = 30;
    this.swordopacity = 0;
    this.direction = "static";
  }
  swing() {
    if (this.angle == 30) {
      this.direction = "right";
    } else if (this.angle == 150) {
      this.direction = "left";
    }
  }

  update(deltaTime: number) {
    if (this.direction !== "static") {
      if (this.angle >= 140 && this.direction == "right") {
        this.direction = "static";
        this.angle = 150;
      } else if (this.angle <= 40 && this.direction == "left") {
        this.direction = "static";
        this.angle = 30;
      } else {
        this.angle +=
          (this.direction === "right" ? 1 : -1) * 150 * deltaTime * 4;
      }
    }
  }
}
