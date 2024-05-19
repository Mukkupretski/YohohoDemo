import { Socket } from "socket.io-client";
import { IMAGE_PATH, NO_RENDER_COLOR } from "./constants";
import { OwnPlayer, Player } from "./playerclasses";
import { Thing } from "./thingclasses";
import { ClientToServerEvents, ServerToClientEvents } from "./eventtypes";
import { SerializedItem } from "./serialtypes";
import { Keys, Picture } from "./othertypes";
import { ImageEnum, getImage } from "./Images";

export interface OwnItem {
  update: (
    deltaTime: number,
    keys: Keys,
    spacebarCallback: () => void,
    socket: Socket<ServerToClientEvents, ClientToServerEvents>
  ) => void;
  preventsMovement: () => boolean;
  preventsExternalForces: () => boolean;
  preventsSwitchingItem: () => boolean;
  preventsSpacebarHold: () => boolean;
  owner: OwnPlayer;
  reset: () => void;
}

export abstract class Item {
  owner: Player;
  angle: number;
  handsize: number;
  width: number;
  height: number;
  handPic: Picture;
  constructor(owner: Player, angle: number, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.owner = owner;
    this.handsize = 64;
    console.log(this.owner.picture.coords);
    this.handPic = {
      image: ImageEnum.HAND,
      coords: {
        x: this.owner.picture.coords!.x / 4,
        y: this.owner.picture.coords!.y / 4,
        width: 64,
        height: 64,
      },
    };
  }
  abstract serialize(): SerializedItem;
  abstract draw(player: OwnPlayer, context: CanvasRenderingContext2D): void;
  updateHand(): void {
    this.handPic.coords!.x = this.owner.picture.coords!.x / 4;
    this.handPic.coords!.y = this.owner.picture.coords!.x / 4;
  }
  drawHandAndTranlate(player: OwnPlayer, context: CanvasRenderingContext2D) {
    const scale = this.owner.size / player.size;
    context.save();
    Thing.doTranslate(player, context, this.owner);
    context.rotate(((this.angle - this.owner.rotation) / 180) * Math.PI);
    context.fillStyle = NO_RENDER_COLOR;
    //Hand: center, center of player edge, size: 64px
    const img = getImage(this.handPic.image);
    if (img) {
      const coords = this.handPic.coords!;
      context.drawImage(
        img,
        coords.x,
        coords.y,
        coords.width,
        coords.height,
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
