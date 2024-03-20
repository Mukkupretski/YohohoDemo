import { Skins, Swords, getSkinPos } from "./enums";
import { Sword } from "./playermiscclasses";

export abstract class Player {
  rotation: number;
  x: number;
  y: number;
  size: number;
  name: string;
  width: number;
  health: number;
  height: number;
  image: CanvasImageSource | undefined;
  speedVector: [number, number];
  skin: Skins;
  swordskin: Swords;
  sword: Sword;
  constructor(
    x: number,
    y: number,
    size: number,
    skin: Skins,
    swordskin: Swords,
    rotation: number,
    health: number,
    name: string
  ) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.width = 256;
    this.height = 256;
    this.skin = skin;
    this.sword = new Sword(this);
    this.rotation = rotation;
    this.swordskin = swordskin;
    this.health = health;
    this.speedVector = [0, 0];
    this.name = name;
    const skinImage = document.createElement("img");
    skinImage.src = "../Images/skinsheet.png";
    skinImage.onload = () => {
      this.image = skinImage;
    };
  }
  abstract draw(player: OwnPlayer, context: CanvasRenderingContext2D): void;

  changeSkin(skin: Skins): void {
    this.skin = skin;
  }
  changeSwordSkin(swordskin: Swords): void {
    this.swordskin = swordskin;
  }
}

export class OwnPlayer extends Player {
  targetrotation: number;
  coins: number;
  isDashing: boolean;
  isAttacking: boolean;
  constructor(x: number, y: number, skin: Skins, swordskin: Swords) {
    super(x, y, 1, skin, swordskin, 0, 100, "");
    this.targetrotation = 0;
    this.coins = 0;
    this.isDashing = false;
    this.isAttacking = false;
  }
  draw(player: OwnPlayer, context: CanvasRenderingContext2D): void {
    context.save();
    context.rotate((-this.rotation * Math.PI) / 180);
    context.translate(context.canvas.width, context.canvas.height);
    const skinpos = getSkinPos(this.skin);
    if (this.image) {
      context.drawImage(
        this.image,
        256 * skinpos[0],
        256 * skinpos[1],
        256,
        256,
        -this.width / 2,
        -this.width / 2,
        this.width,
        this.height
      );
    } else {
      context.fillRect(
        -this.width / 2,
        -this.width / 2,
        this.width,
        this.height
      );
    }
    context.restore();
  }
  update(
    context: CanvasRenderingContext2D,
    keys: {
      w: boolean;
      d: boolean;
      s: boolean;
      a: boolean;
      spacebartime: number;
    }
  ): void {
    if (this.isDashing) {
    } else if (this.isAttacking) {
    } else if (keys.spacebartime != 0) {
      if (keys.spacebartime < 1) {
        this.isAttacking = true;
      } else {
        const power = Math.max(keys.spacebartime / 1000, 3);
        this.speedVector = [power, 0];
      }
    }
    //Happens only if player is not attacking or geometry dashing
    else {
      //Set speed vector by which keys are pressed
      this.speedVector = [
        (keys.a ? -10 : 0) + (keys.d ? 10 : 0),
        (keys.w ? -10 : 0) + (keys.s ? 10 : 0),
      ];
      //Set target rotation (using dot product)
      this.targetrotation =
        (180 / Math.PI) *
        Math.acos(
          this.speedVector[1] /
            Math.sqrt(this.speedVector[0] ** 2 + this.speedVector[1] ** 2)
        );
      if (this.speedVector[0] > 0) {
        this.targetrotation = 360 - this.targetrotation;
      }
      //Rotate player
      if (this.rotation != this.targetrotation) {
        if (Math.abs(this.rotation - this.targetrotation) < 10) {
          this.rotation = this.targetrotation;
        } else {
          //Probably works but might not
          this.rotation =
            (this.rotation +
              Math.sign(this.targetrotation - this.rotation) *
                (Math.abs(this.rotation - this.targetrotation) > 180
                  ? -5
                  : 5)) %
            360;
          if (this.rotation < 0) {
            this.rotation += 360;
          }
        }
      }
    }
    this.draw(this, context);
  }
}
export class OtherPlayer extends Player {
  id: string;
  constructor(
    x: number,
    y: number,
    size: number,
    skin: Skins,
    swordskin: Swords,
    rotation: number,
    health: number,
    id: string,
    name: string
  ) {
    super(x, y, size, skin, swordskin, rotation, health, name);
    this.id = id;
  }
  draw(player: OwnPlayer, context: CanvasRenderingContext2D): void {}
  update(player: OwnPlayer, context: CanvasRenderingContext2D): void {}
}
