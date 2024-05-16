import { Socket } from "socket.io-client";
import { IMAGE_PATH, NO_RENDER_COLOR } from "./constants";
import { OwnPlayer, Player } from "./playerclasses";
import { Thing } from "./thingclasses";
import { ClientToServerEvents, ServerToClientEvents } from "./eventtypes";

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
