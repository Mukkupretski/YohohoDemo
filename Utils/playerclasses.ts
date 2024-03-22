import { IMAGE_PATH, NO_RENDER_COLOR } from "./constants";
import { Skins, Swords, getSkinPos } from "./enums";
import { PlayerHeader, Sword } from "./playermiscclasses";
import { Thing } from "./thingclasses";
import { SerializedOtherPlayer, SerializedPlayer } from "./serialtypes";

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
  skin: Skins;
  swordskin: Swords;
  sword: Sword;
  playerheader: PlayerHeader;
  swordopacity: number;
  constructor(
    x: number,
    y: number,
    size: number,
    skin: Skins,
    swordskin: Swords,
    rotation: number,
    health: number,
    name: string,
    swordopacity: number
  ) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.width = 256;
    this.height = 256;
    this.skin = skin;
    this.sword = new Sword(this);
    this.playerheader = new PlayerHeader(this);
    this.rotation = rotation;
    this.swordskin = swordskin;
    this.health = health;

    this.name = name;
    this.swordopacity = swordopacity;
    const skinImage = document.createElement("img");
    skinImage.src = `${IMAGE_PATH}/skinsheet.png`;
    skinImage.onload = () => {
      this.image = skinImage;
    };
  }
  draw(player: OwnPlayer, context: CanvasRenderingContext2D): void {
    if (!Thing.isInscreen(player, context.canvas, this)) return;
    const scale = this.size / player.size;
    //Draw sword and header
    this.sword.update(player, context);
    this.playerheader.update(player, context);
    //Do actual drawing
    context.save();
    context.rotate((-this.rotation / 180) * Math.PI);
    Thing.doTranslate(player, context, this, this.size);
    if (this.image) {
      const skinpos = getSkinPos(this.skin);
      context.drawImage(
        this.image,
        256 * skinpos[0],
        256 * skinpos[1],
        256,
        256,
        (-this.width / 2) * scale,
        (-this.width / 2) * scale,
        this.width * scale,
        this.height * scale
      );
    } else {
      context.fillStyle = NO_RENDER_COLOR;
      context.fillRect(
        (-this.width / 2) * scale,
        (-this.width / 2) * scale,
        this.width * scale,
        this.height * scale
      );
    }
    context.restore();
  }
}

export class OwnPlayer extends Player {
  targetrotation: number;
  coins: number;
  dashAcc: number;
  isAttacking: boolean;
  speedVector: [number, number];
  constructor(x: number, y: number, skin: Skins, swordskin: Swords) {
    super(x, y, 1, skin, swordskin, 0, 100, "", 0);
    this.targetrotation = 0;
    this.coins = 0;
    this.speedVector = [0, 0];
    this.dashAcc = 0;
    this.isAttacking = false;
  }
  update(
    context: CanvasRenderingContext2D,
    keys: {
      w: boolean;
      d: boolean;
      s: boolean;
      a: boolean;
      spacebartime: number;
      spacebarhold: number;
    }
  ): void {
    //Check if spacebar was pressed and there is no current spacebar action
    if (keys.spacebartime != 0 && !this.isAttacking && this.dashAcc != 0) {
      //Swing attack
      if (keys.spacebartime < 1) {
        this.isAttacking = true;
        this.sword.swing();
        //Geometry dash attack
      } else {
        const power = Math.min(keys.spacebartime / 1000, 3);
        this.speedVector = [
          power * Math.cos(((this.rotation + 90) / 180) * Math.PI),
          power * Math.sin(((this.rotation + 90) / 180) * Math.PI),
        ];
        this.dashAcc = power / 8;
      }
    }
    //Slowing dash
    if (this.dashAcc != 0) {
      if (this.speedVector[0] < 0)
        this.speedVector[0] -=
          this.dashAcc * Math.cos(((this.rotation + 90) / 180) * Math.PI);
      this.speedVector[1] -=
        this.dashAcc * Math.sin(((this.rotation + 90) / 180) * Math.PI);
      //Stopping dash when slow enough
      if (
        Math.abs(this.speedVector[0]) <= 1 &&
        Math.abs(this.speedVector[1]) <= 1
      ) {
        this.dashAcc = 0;
      }
    } else if (this.isAttacking) {
      this.speedVector = [0, 0];
      if (this.sword.direction === "static") {
        this.isAttacking = false;
      }
    }
    //Happens only if player is not attacking or geometry dashing
    else {
      //Changing sword opacity
      this.swordopacity = Math.min(keys.spacebarhold / 1000, 1);
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
    this.x += this.speedVector[0];
    this.y += this.speedVector[1];
    this.draw(this, context);
  }
  changeSkin(skin: Skins): void {
    this.skin = skin;
  }
  changeSwordSkin(swordskin: Swords): void {
    this.swordskin = swordskin;
  }
  grow(amount: number) {
    this.size += amount / 10;
    this.health = 100 * this.size;
  }

  serialize(): SerializedPlayer {
    return {
      health: this.health,
      x: this.x,
      y: this.y,
      name: this.name,
      size: this.size,
      skin: this.skin,
      swordskin: this.swordskin,
      swordopacity: this.swordopacity,
      rotation: this.rotation,
    };
  }
}
export class OtherPlayer extends Player {
  id: string;
  constructor({
    x,
    y,
    size,
    skin,
    swordopacity,
    swordskin,
    rotation,
    health,
    id,
    name,
  }: {
    x: number;
    y: number;
    size: number;
    skin: Skins;
    swordskin: Swords;
    rotation: number;
    health: number;
    id: string;
    name: string;
    swordopacity: number;
  }) {
    super(x, y, size, skin, swordskin, rotation, health, name, swordopacity);
    this.id = id;
  }
  update(player: OwnPlayer, context: CanvasRenderingContext2D): void {
    this.draw(player, context);
  }
  setProperties(player: SerializedOtherPlayer) {
    this.x = player.x;
    this.y = player.y;
    this.size = player.size;
    this.skin = player.skin;
    this.swordskin = player.swordskin;
    this.health = player.health;
    this.rotation = player.rotation;
    this.name = player.name;
    this.swordopacity = player.swordopacity;
  }
}
