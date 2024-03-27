import { Swords, getSkinPos, getSwordPos } from "./enums";
import { OtherPlayer, OwnPlayer, Player } from "./playerclasses";
import { Thing } from "./thingclasses";
import {
  IMAGE_PATH,
  NO_RENDER_COLOR,
  PLAYER_HEADER_PADDING,
} from "./constants";
import { SerializedSword } from "./serialtypes";

export type Obj = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export class PlayerHeader {
  owner: Player;
  barHeight: number;
  barwidth: number;
  constructor(owner: Player) {
    this.barwidth = 192;
    this.barHeight = 32;
    this.owner = owner;
  }
  draw(player: OwnPlayer, context: CanvasRenderingContext2D) {
    const scale = this.owner.size / player.size;
    context.save();
    Thing.doTranslate(player, context, this.owner, this.owner.size);
    //How heights are calculated:
    //Player: 128px, gap: 10px, healthbar: 32px, gap: 10px,
    //And scaled by player width
    context.strokeStyle = "none";
    context.fillStyle = "red";
    context.fillRect(
      (-this.barwidth / 2) * scale,
      (-this.owner.width / 2 - PLAYER_HEADER_PADDING - this.barHeight) * scale,
      this.barwidth * scale,
      this.barHeight * scale
    );
    context.fillStyle = "green";
    context.fillRect(
      (-this.barwidth / 2) * scale,
      (-this.owner.width / 2 - PLAYER_HEADER_PADDING - this.barHeight) * scale,
      (this.barwidth * scale * this.owner.health) / (100 * this.owner.size),
      this.barHeight * scale
    );
    context.textAlign = "center";
    context.textBaseline = "bottom";
    context.fillStyle = NO_RENDER_COLOR;
    context.font = `${Math.round(this.barHeight * scale)}px Arial`;
    context.fillText(
      this.owner.name,
      0,
      (-this.owner.width / 2 -
        PLAYER_HEADER_PADDING -
        this.barHeight -
        PLAYER_HEADER_PADDING) *
        scale
    );
    context.restore();
  }
  update(player: OwnPlayer, context: CanvasRenderingContext2D) {
    this.draw(player, context);
  }
}

export class Sword {
  owner: Player;
  handimg: CanvasImageSource | undefined;
  swordimg: CanvasImageSource | undefined;
  angle: number;
  swordopacity: number;
  swordskin: Swords;
  swordwidth: number;
  swordheight: number;
  handsize: number;

  constructor(
    owner: Player,
    swordskin: Swords,
    angle: number,
    swordopacity: number
  ) {
    this.swordheight = 64;
    this.swordwidth = 256;
    this.handsize = 64;
    this.swordskin = swordskin;
    this.angle = angle;
    this.swordopacity = swordopacity;
    this.owner = owner;
    const handel = document.createElement("img");
    handel.src = `${IMAGE_PATH}/handsheet.png`;
    handel.onload = () => {
      this.handimg = handel;
    };
    const swordel = document.createElement("img");
    swordel.src = `${IMAGE_PATH}/swordsheet.png`;
    swordel.onload = () => {
      this.swordimg = swordel;
    };
  }

  draw(player: OwnPlayer, context: CanvasRenderingContext2D) {
    const scale = this.owner.size / player.size;
    context.save();
    Thing.doTranslate(player, context, this.owner, this.owner.size);
    context.rotate(((this.angle - this.owner.rotation) / 180) * Math.PI);
    context.fillStyle = NO_RENDER_COLOR;
    //Hand: center, center of player edge, size: 64px
    if (this.handimg) {
      const skinpos = getSkinPos(this.owner.skin);
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
    //Sword: handle at player's width's end, height centered to player's center
    if (this.swordimg) {
      const skinpos = getSwordPos(this.swordskin);
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
  update(player: OwnPlayer, context: CanvasRenderingContext2D) {
    this.draw(player, context);
  }
  serialize(): SerializedSword {
    return {
      angle: this.angle,
      swordopacity: this.swordopacity,
      swordskin: this.swordskin,
      swordwidth: this.swordwidth,
      swordheigh: this.swordheight,
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

  update(player: OwnPlayer, context: CanvasRenderingContext2D) {
    if (this.direction !== "static") {
      if (this.angle >= 150 && this.direction == "right") {
        this.direction = "static";
        this.angle = 150;
      } else if (this.angle <= 30 && this.direction == "left") {
        this.direction = "static";
        this.angle = 30;
      } else {
        this.angle += (this.direction === "right" ? 1 : -1) * 15;
      }
    }

    this.draw(player, context);
  }
}
export class OtherSword extends Sword {
  constructor(
    owner: OtherPlayer,
    swordskin: Swords,
    angle: number,
    swordopacity: number
  ) {
    super(owner, swordskin, angle, swordopacity);
  }
}
