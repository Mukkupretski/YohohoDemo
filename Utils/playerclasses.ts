import { IMAGE_PATH, NO_RENDER_COLOR } from "./constants";
import { ItemTypes, Skins, Swords } from "./enums";
import { Emote, PlayerHeader } from "./playermiscclasses";
import { Sword, OwnSword } from "./weaponclasses";
import { Thing } from "./thingclasses";
import {
  SerializedOtherPlayer,
  SerializedPlayer,
  SerializedItem,
} from "./serialtypes";
import { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./eventtypes";
import WorldMap from "./WorldMap";
import { Item, OwnItem } from "./itemclasses";
import { Keys, Picture } from "./othertypes";
import { ImageEnum, getImage } from "./Images";

export abstract class Player {
  rotation: number;
  x: number;
  y: number;
  size: number;
  name: string;
  width: number;
  health: number;
  height: number;
  picture: Picture;
  playerheader: PlayerHeader;
  emote: Emote | undefined;
  constructor(
    x: number,
    y: number,
    size: number,
    skin: Skins | Picture,
    rotation: number,
    health: number,
    name: string
  ) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.width = 256;
    this.height = 256;
    if (typeof skin === "number") {
      this.picture = {
        image: ImageEnum.SKIN,
        coords: {
          x: 256 * (skin % 4),
          y: 256 * Math.floor(skin / 4),
          width: 256,
          height: 256,
        },
      };
    } else {
      this.picture = skin;
    }
    this.playerheader = new PlayerHeader(this);
    this.rotation = rotation;
    this.health = health;

    this.name = name;
  }
  draw(player: OwnPlayer, context: CanvasRenderingContext2D): void {
    if (!Thing.isInscreen(player, context.canvas, this)) return;
    const scale = this.size / player.size;
    //Draw sword and header
    let item = undefined;
    if (
      this instanceof OwnPlayer &&
      this.inventoryIndex < this.inventory.length
    ) {
      item = this.getCurrentItem();
    } else if (this instanceof OtherPlayer) {
      item = this.item;
    }
    item?.draw(player, context);
    this.playerheader.draw(player, context);
    if (this.emote != undefined) {
      this.emote.draw(player, context);
    }
    //Do actual drawing
    context.save();

    Thing.doTranslate(player, context, this);
    context.rotate((-this.rotation / 180) * Math.PI);
    const img = getImage(this.picture.image);
    if (img) {
      const coords = this.picture.coords!;
      context.drawImage(
        img,
        coords.x,
        coords.y,
        coords.width,
        coords.height,

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
  setEmote(id: number) {
    if (!this.emote) {
      this.emote = new Emote(id, this);
      setTimeout(() => {
        this.emote = undefined;
      }, this.emote.animation.time * 1000 + 1000);
    }
  }
  setSkin(skin: Skins): void {
    this.picture.coords!.x = (skin % 4) * 256;
    this.picture.coords!.y = Math.floor(skin / 4) * 256;
    if (this instanceof OwnPlayer) {
      this.inventory.forEach((item) => {
        item.updateHand();
      });
    } else if (this instanceof OtherPlayer) {
      this.item?.updateHand();
    }
  }
}

export class OwnPlayer extends Player {
  targetrotation: number;
  coins: number;

  speedVector: [number, number];

  externalForces: [number, number];
  speed: number;
  lastUpdate: number;
  timeouts: ReturnType<typeof setTimeout>[];
  inventory: (Item & OwnItem)[];
  inventoryIndex: number;
  constructor(x: number, y: number, skin: Skins, items: (Item & OwnItem)[]) {
    super(x, y, 1, skin, 0, 100, "");
    this.targetrotation = 0;
    this.coins = 0;
    this.speedVector = [0, 0];
    this.externalForces = [0, 0];

    this.speed = 1;
    this.lastUpdate = Date.now();

    this.timeouts = [];
    this.inventory = items;
    this.inventoryIndex = 0;
  }
  update(
    context: CanvasRenderingContext2D,
    keys: Keys,
    spacebarCallback: () => void,
    socket: Socket<ServerToClientEvents, ClientToServerEvents>,
    map: WorldMap
  ): void {
    const deltaTime = (Date.now() - this.lastUpdate) / 1000;
    this.lastUpdate = Date.now();
    let currentItem;
    if (this.inventoryIndex < this.inventory.length) {
      currentItem = this.getCurrentItem();
      currentItem.update(deltaTime, keys, spacebarCallback, socket);
    }
    if (!currentItem || !currentItem.preventsMovement()) {
      //Set speed vector by which keys are pressed
      this.speedVector = [
        (keys.a ? -10 : 0) + (keys.d ? 10 : 0),
        (keys.w ? -10 : 0) + (keys.s ? 10 : 0),
      ];
      //Set target rotation (using dot product)
      if (this.speedVector[0] ** 2 + this.speedVector[1] ** 2 > 0) {
        this.targetrotation =
          (180 / Math.PI) *
          Math.acos(
            //Flipping y because positive should actually be up
            -this.speedVector[1] /
              Math.sqrt(this.speedVector[0] ** 2 + this.speedVector[1] ** 2)
          );
      }
      if (this.speedVector[0] > 0) {
        this.targetrotation = 360 - this.targetrotation;
      }
      //Rotate player
      if (this.rotation != this.targetrotation) {
        if (Math.abs(this.rotation - this.targetrotation) < 10) {
          this.rotation = this.targetrotation;
        } else {
          //Probably works but might not - clarification: didn't work but now does
          this.rotation =
            (this.rotation +
              Math.sign(this.targetrotation - this.rotation) *
                (Math.abs(this.rotation - this.targetrotation) > 180 ? -1 : 1) *
                deltaTime *
                250) %
            360;
          if (this.rotation < 0) {
            this.rotation += 360;
          }
        }
      }
      this.x += this.speedVector[0] * this.speed * deltaTime * 60;
      this.y += this.speedVector[1] * this.speed * deltaTime * 60;
    }
    if (!currentItem || !currentItem.preventsExternalForces()) {
      this.x += this.externalForces[0] * deltaTime;

      this.y += this.externalForces[1] * deltaTime;
    }
    this.returnToMap(map);
    this.draw(this, context);
  }
  applyExternalForce(force: [number, number], duration: number) {
    this.externalForces[0] += force[0];
    this.externalForces[1] += force[1];
    this.timeouts.push(
      setTimeout(() => {
        this.externalForces[0] -= force[0];
        this.externalForces[1] -= force[1];
      }, 1000 * duration)
    );
  }
  setSpeed(speed: number) {
    this.speed = speed;
  }
  returnToMap(map: WorldMap) {
    if (this.x < (this.width * this.size) / 2) {
      this.x = (this.width * this.size) / 2;
    }
    if (this.y < (this.height * this.size) / 2) {
      this.y = (this.height * this.size) / 2;
    }
    if (this.x > map.size - (this.width * this.size) / 2) {
      this.x = map.size - (this.width * this.size) / 2;
    }
    if (this.y > map.size - (this.height * this.size) / 2) {
      this.y = map.size - (this.height * this.size) / 2;
    }
  }
  grow(amount: number) {
    this.size += amount / 10;
    this.health = this.health * this.size;
  }
  removeHealth(amount: number) {
    this.health -= amount;
  }
  getCurrentItem(): Item & OwnItem {
    return this.inventory[this.inventoryIndex];
  }
  reset(): void {
    this.timeouts.forEach((t) => {
      clearTimeout(t);
    });
    this.externalForces = [0, 0];
    this.inventory.forEach((item) => {
      item.reset();
    });
    this.size = 1;
    this.x = 1000;
    this.y = 500;
    this.health = 100;
  }
  serialize(): SerializedPlayer {
    return {
      health: this.health,
      x: this.x,
      y: this.y,
      name: this.name,
      size: this.size,
      picture: this.picture,
      item: this.getCurrentItem().serialize(),
      rotation: this.rotation,
      height: this.height,
      width: this.width,
    };
  }
}
export class OtherPlayer extends Player {
  id: string;
  item: Item | undefined;
  constructor({
    x,
    y,
    size,
    picture,
    item,
    rotation,
    health,
    id,
    name,
  }: SerializedOtherPlayer) {
    super(x, y, size, picture, rotation, health, name);
    this.id = id;
    this.setItem(item);
  }
  update(player: OwnPlayer, context: CanvasRenderingContext2D): void {
    this.draw(player, context);
  }
  setItem(item: SerializedItem | undefined) {
    if (!item) {
      this.item = undefined;
      return;
    }
    if (item.type == ItemTypes.SWORD) {
      this.item = new Sword(this, item.angle, item.opacity!, item.picture);
    }
  }
  setProperties(player: SerializedOtherPlayer) {
    this.x = player.x;
    this.y = player.y;
    this.size = player.size;
    this.picture = player.picture;
    this.health = player.health;
    this.rotation = player.rotation;
    this.name = player.name;
  }
}
