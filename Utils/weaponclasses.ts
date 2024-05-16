import { Socket } from "socket.io-client";
import { IMAGE_PATH, NO_RENDER_COLOR } from "./constants";
import { Swords } from "./enums";
import { Item, OwnItem } from "./itemclasses";
import { OwnPlayer, Player } from "./playerclasses";
import { SerializedSword } from "./serialtypes";
import { ClientToServerEvents, ServerToClientEvents } from "./eventtypes";
import { EasingFunction } from "./animationlib";

export class Sword extends Item {
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

export class OwnSword extends Sword implements OwnItem {
  direction: "static" | "left" | "right";
  dashEnd?: [number, number];
  dashStart: [number, number, number];
  owner: OwnPlayer;
  isAttacking: boolean;
  power: number;
  constructor(owner: OwnPlayer, swordskin: Swords) {
    super(owner, swordskin, 30, 0);
    this.direction = "static";
    this.owner = owner;
    this.power = 0;
    this.isAttacking = false;
    this.dashStart = [0, 0, 0];
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
      this.swordopacity = Math.min(keys.spacebarhold / 1000, 2) / 2;
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
