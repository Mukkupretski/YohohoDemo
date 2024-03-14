import { Skins, getSkinPath } from "./enums";

export abstract class Player {
  rotation: number;
  x: number;
  y: number;
  size: number;
  width: number;
  health: number;
  height: number;
  image: CanvasImageSource | undefined;
  speedVector: [number, number];
  skin: Skins;
  constructor(
    x: number,
    y: number,
    size: number,
    skin: Skins,
    rotation: number,
    health: number
  ) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.width = 256;
    this.height = 256;
    this.skin = skin;
    this.rotation = rotation;
    this.health = health;
    this.speedVector = [0, 0];

    const skinImage = document.createElement("img");
    skinImage.src = "Images/skinsheet.png";
    skinImage.onload = () => {
      this.image = skinImage;
    };
  }
  abstract draw(player: OwnPlayer, context: CanvasRenderingContext2D): void;

  changeSkin(skin: Skins): void {
    const skinImage = document.createElement("img");
    skinImage.src = "Images/skinsheet.png";
    skinImage.onload = () => {
      this.image = skinImage;
    };
  }
}

export class OwnPlayer extends Player {
  targetrotation: number;
  coins: number;
  isDashing: boolean;
  isAttacking: boolean;
  constructor(x: number, y: number, skin: Skins) {
    super(x, y, 1, skin, 0, 100);
    this.targetrotation = 0;
    this.coins = 0;
    this.isDashing = false;
    this.isAttacking = false;
  }
  draw(player: OwnPlayer, context: CanvasRenderingContext2D): void {
    context.save();
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
                  ? 5
                  : -5)) %
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
  constructor(
    x: number,
    y: number,
    size: number,
    skin: Skins,
    rotation: number,
    health: number,
    id: string
  ) {
    super(x, y, size, skin, rotation, health);
  }
  draw(player: OwnPlayer, context: CanvasRenderingContext2D): void {}
  update(player: OwnPlayer, context: CanvasRenderingContext2D): void {}
}
