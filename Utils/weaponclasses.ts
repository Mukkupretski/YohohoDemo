import { Socket } from "socket.io-client";
import { ItemTypes, Swords } from "./enums";
import { Item, OwnItem } from "./itemclasses";
import { OwnPlayer, Player } from "./playerclasses";
import { SerializedItem } from "./serialtypes";
import { ClientToServerEvents, ServerToClientEvents } from "./eventtypes";
import { EasingFunction } from "./animationlib";
import { Keys, Picture } from "./othertypes";
import { ImageEnum, getImage } from "./Images";

export class Sword extends Item {
  opacity: number;
  picture: Picture;
  constructor(
    owner: Player,
    angle: number,
    opacity: number,
    sword: Swords | Picture
  ) {
    super(owner, angle, 256, 64);
    this.opacity = opacity;
    if (typeof sword === "number") {
      this.picture = {
        image: ImageEnum.SWORD,
        coords: {
          x: (sword % 4) * 256,
          y: Math.floor(sword / 4) * 128,
          width: 256,
          height: 64,
        },
      };
    } else {
      this.picture = sword;
    }
  }

  draw(player: OwnPlayer, context: CanvasRenderingContext2D) {
    this.drawHandAndTranlate(player, context);
    const scale = this.owner.size / player.size;
    //Sword: handle at player's width's end, height centered to player's center
    const img = getImage(this.picture.image);
    if (img) {
      const coords = this.picture.coords!;
      context.drawImage(
        img,
        coords.x,
        coords.y,
        coords.width,
        coords.height,
        (-this.owner.width / 2 - this.width) * scale,
        -this.height * scale,
        this.width * scale,
        this.height * scale
      );
      context.globalAlpha = this.opacity;
      context.drawImage(
        img,
        coords.x,
        coords.y + 64,
        coords.width,
        coords.height,
        (-this.owner.width / 2 - this.width) * scale,
        -this.height * scale,
        this.width * scale,
        this.height * scale
      );
    } else {
      context.fillRect(
        (-this.owner.width - this.width / 2) * scale,
        -this.height * scale,
        this.width * scale,
        this.height * scale
      );
    }
    context.restore();
  }

  serialize(): SerializedItem {
    return {
      angle: this.angle,
      opacity: this.opacity,
      picture: this.picture,
      width: this.width,
      height: this.height,
      type: ItemTypes.SWORD,
    };
  }
  setSword(sword: SerializedItem): void {
    this.angle = sword.angle;
    this.opacity = sword.opacity!;
    this.picture = sword.picture;
  }
  setSkin(skin: Swords): void {
    this.picture.coords!.x = (skin % 4) * 256;
    this.picture.coords!.y = Math.floor(skin / 4) * 128;
  }
}

export class OwnSword extends Sword implements OwnItem {
  direction: "static" | "left" | "right";
  dashEnd?: [number, number];
  dashStart: [number, number, number];
  owner: OwnPlayer;
  isAttacking: boolean;
  power: number;
  constructor(owner: OwnPlayer, swordskin: Swords) {
    super(owner, 30, 0, swordskin);
    this.direction = "static";
    this.power = 0;
    this.owner = owner;
    this.isAttacking = false;
    this.dashStart = [0, 0, 0];
  }

  reset(): void {
    this.angle = 30;
    this.opacity = 0;
    this.direction = "static";
  }
  swing() {
    if (this.angle == 30) {
      this.direction = "right";
    } else if (this.angle == 150) {
      this.direction = "left";
    }
  }
  preventsExternalForces() {
    return this.isAttacking || this.dashEnd != undefined;
  }
  preventsSwitchingItem() {
    return this.isAttacking || this.dashEnd != undefined;
  }
  preventsMovement() {
    return this.isAttacking || this.dashEnd != undefined;
  }
  preventsSpacebarHold() {
    return this.isAttacking || this.dashEnd != undefined;
  }
  update(
    deltaTime: number,
    keys: Keys,
    spacebarCallback: () => void,
    socket: Socket<ServerToClientEvents, ClientToServerEvents>
  ) {
    //Check if spacebar was pressed and there is no current spacebar action

    if (keys.spacebartime != 0 && !this.isAttacking && !this.dashEnd) {
      console.log("Sw");
      //Swing attack if time under 300 ms
      if (keys.spacebartime < 300) {
        this.isAttacking = true;
        this.swing();
        //Geometry dash attack
      } else {
        this.power = Math.min(keys.spacebartime / 1000, 2) * 40;
        const targetDistance: number = 20 * this.power;
        this.dashStart = [this.owner.x, this.owner.y, Date.now()];
        this.dashEnd = [
          this.owner.x +
            targetDistance *
              Math.cos(((this.owner.rotation + 90) / 180) * Math.PI),
          this.owner.y -
            targetDistance *
              Math.sin(((this.owner.rotation + 90) / 180) * Math.PI),
        ];
        this.swing();
      }
      spacebarCallback();
    }
    //Slowing dash
    if (this.dashEnd) {
      const easing = EasingFunction.easeOut(
        (Date.now() - this.dashStart[2]) / 1000,
        0.125
      );
      this.owner.x =
        this.dashStart[0] * (1 - easing) + this.dashEnd[0] * easing;
      this.owner.y =
        this.dashStart[1] * (1 - easing) + this.dashEnd[1] * easing;
      //Stopping dash when slow enough
      if ((Date.now() - this.dashStart[2]) / 1000 >= 0.125) {
        socket.emit("dash", this.owner.serialize(), this.power, [
          this.dashStart[0],
          this.dashStart[1],
        ]);
        socket.emit("swing", this.owner.serialize(), "dash");
        this.dashEnd = undefined;
      }
    } else if (this.isAttacking) {
      if (this.direction === "static") {
        socket.emit("swing", this.owner.serialize(), "swing");
        this.isAttacking = false;
      }
    }
    if (!this.preventsSpacebarHold()) {
      this.opacity = Math.min(keys.spacebarhold / 1000, 2) / 2;
    }
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
