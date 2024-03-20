import { Swords, getSkinPos, getSwordPos } from "./enums";
import { OwnPlayer, Player } from "./playerclasses";
import { Thing } from "./thingclasses";

export type Obj = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export class PlayerHeader {
  owner: Player;
  constructor(owner: Player) {
    this.owner = owner;
  }
  draw(player: OwnPlayer, context: CanvasRenderingContext2D) {
    context.save();
    Thing.doTranslate(player, context, this.owner, this.owner.size);
    //How heights are calculated:
    //Player: 128px, gap: 10px, healthbar: 32px, gap: 10px,
    //And scaled by player width
    context.strokeStyle = "none";
    context.fillStyle = "red";
    context.fillRect(
      -96 / player.size,
      (-this.owner.width / 2 - 10 - 32) / player.size,
      192 / player.size,
      32 / player.size
    );
    context.fillStyle = "green";
    context.fillRect(
      -96 / player.size,
      (-this.owner.width / 2 - 10 - 32) / player.size,
      ((this.owner.health / (this.owner.size * 100)) * 192) / player.size,
      32 / player.size
    );
    context.textAlign = "center";
    context.textBaseline = "bottom";
    context.fillStyle = "black";
    context.font = `${32 / player.width}px Arial`;
    context.fillText;
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
  direction: "static" | "left" | "right";

  constructor(owner: Player) {
    this.angle = 30;
    this.direction = "static";
    this.owner = owner;
    const handel = document.createElement("img");
    handel.src = "../Images/handsheet.png";
    handel.onload = () => {
      this.handimg = handel;
    };
    const swordel = document.createElement("img");
    swordel.src = "../Images/swordsheet.png";
    swordel.onload = () => {
      this.swordimg = swordel;
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
    context.save();
    context.rotate(((this.angle - this.owner.rotation) / 180) * Math.PI);
    Thing.doTranslate(player, context, this.owner, this.owner.size);
    context.fillStyle = "black";
    if (this.handimg) {
      const skinpos = getSkinPos(this.owner.skin);
      context.drawImage(
        this.handimg,
        skinpos[0] * 64,
        skinpos[1] * 64,
        64,
        64,
        (-this.owner.width - 32) / player.width,
        -32 / player.width,
        64 / player.width,
        64 / player.width
      );
    } else {
      context.fillRect(
        (-this.owner.width - 32) / player.width,
        -32 / player.width,
        64 / player.width,
        64 / player.width
      );
    }
    if (this.swordimg) {
      const skinpos = getSwordPos(this.owner.swordskin);
      context.drawImage(
        this.swordimg,
        skinpos[0] * 256,
        skinpos[1] * 64,
        256,
        64,
        (-this.owner.width - 128) / player.width,
        -32 / player.width,
        256 / player.width,
        64 / player.width
      );
    } else {
      context.fillRect(
        (-this.owner.width - 128) / player.width,
        -32 / player.width,
        256 / player.width,
        64 / player.width
      );
    }
    context.restore();
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
