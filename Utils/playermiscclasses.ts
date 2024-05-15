import { Swords } from "./enums";
import { OtherPlayer, OwnPlayer, Player } from "./playerclasses";
import { Thing } from "./thingclasses";
import {
  IMAGE_PATH,
  NO_RENDER_COLOR,
  PLAYER_HEADER_PADDING,
} from "./constants";
import { SerializedSword } from "./serialtypes";
import { Animation } from "./animationlib";
import { chatbubble, getAnimationById } from "./animations";

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
    Thing.doTranslate(player, context, this.owner);
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
}

export class Emote {
  animation: Animation;
  owner: Player;
  constructor(id: number, player: Player) {
    this.animation = getAnimationById(id);
    this.owner = player;
  }
  draw(player: OwnPlayer, context: CanvasRenderingContext2D): void {
    context.save();
    Thing.doTranslate(player, context, this.owner);
    const scale = this.owner.size / player.size;
    context.translate(
      (player.width / 2) * scale + 64 * scale,
      -(player.height / 2) * scale - 64 * scale
    );
    context.save();
    if (chatbubble) {
      context.drawImage(
        chatbubble,
        -64 * scale,
        -64 * scale,
        128 * scale,
        128 * scale
      );
    } else {
      context.fillStyle = NO_RENDER_COLOR;
      context.fillRect(-64 * scale, -64 * scale, 128 * scale, 128 * scale);
    }
    context.restore();
    this.animation.update(context, scale);
    context.restore();
  }
}
