import { OwnPlayer, Player } from "./playerclasses";
import { Obj } from "./playermiscclasses";
import {
  GRASSPATCH_CENTER,
  IMAGE_PATH,
  MAP_COLOR,
  NO_RENDER_COLOR,
} from "./constants";

export abstract class Thing {
  image: CanvasImageSource | undefined;
  width: number;
  height: number;
  x: number;
  y: number;
  rotation: number;
  constructor(
    imageSrc: string,
    width: number,
    height: number,
    x: number,
    y: number,
    rotation: number
  ) {
    const elem = document.createElement("img");
    elem.src = imageSrc;
    elem.onload = () => {
      this.image = elem;
    };
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.rotation = rotation;
  }
  static isInscreen(
    player: OwnPlayer,
    canvas: HTMLCanvasElement,
    obj: Player | Thing | Obj
  ): boolean {
    return (
      Math.abs(player.x - obj.x) - obj.width / 2 <
        (player.size * canvas.width) / 2 &&
      Math.abs(player.y - obj.y) - obj.height / 2 <
        (player.size * canvas.height) / 2
    );
  }
  draw(player: OwnPlayer, context: CanvasRenderingContext2D): void {
    if (!Thing.isInscreen(player, context.canvas, this)) return;
    context.save();
    context.rotate(((-2 * Math.PI) / 180) * this.rotation);
    Thing.doTranslate(player, context, this);
    if (this.image) {
      context.drawImage(
        this.image,
        -this.width / player.size / 2,
        -this.height / player.size / 2,
        this.width / player.size,
        this.height / player.size
      );
    } else {
      context.fillStyle = NO_RENDER_COLOR;
      context.fillRect(
        -this.width / player.size / 2,
        -this.height / player.size / 2,
        this.width / player.size,
        this.height / player.size
      );
    }
    context.restore();
  }
  update(player: OwnPlayer, context: CanvasRenderingContext2D): void {
    this.draw(player, context);
  }
  static doTranslate(
    player: OwnPlayer,
    context: CanvasRenderingContext2D,
    obj: Thing | Player | Obj,
    size?: number
  ) {
    const scale: number = (size ?? 1) / player.size;
    //1. Put top corner to center
    //2. Put center of the object to center (the width of object is obj.width*scale so we divide that with 2 and same with height)
    //3. Move respectively to the own player's position (scaled by scale)
    //4. Now the object would be at correct place if scale was 1 but else the top corner is offset by width*(1-scale)/2 so we fix that (same with height)
    //5. The square is rendered at ((-width*scale)/2,(-height*scale)/2) for rotation so we fix that offset
    //Note that 2. and 5. cancel each other
    context.translate(
      //X
      context.canvas.width / 2 +
        (obj.width - obj.width * scale) / 2 +
        (obj.x - player.x) * scale,
      //Y
      context.canvas.height / 2 +
        (obj.height - obj.height * scale) / 2 +
        (obj.y - player.y) * scale
    );
  }
}
export abstract class Interactable extends Thing {
  constructor(
    imageSrc: string,
    width: number,
    height: number,
    x: number,
    y: number,
    rotation: number
  ) {
    super(imageSrc, width, height, x, y, rotation);
  }
  overlap(player: OwnPlayer): boolean {
    return (
      (this.width / player.size + player.width) / 2 <
        Math.abs(this.x - player.x) / player.size &&
      (this.height / player.size + player.height) / 2 <
        Math.abs(this.y - player.y) / player.size
    );
  }
  abstract update(player: OwnPlayer, context: CanvasRenderingContext2D): void;
}

export class Tree extends Thing {
  constructor(x: number, y: number, rotation: number) {
    super(`${IMAGE_PATH}/tree.png`, 384, 384, x, y, rotation);
  }
}
export class Bush extends Thing {
  constructor(x: number, y: number, rotation: number) {
    super(`${IMAGE_PATH}/bush.png`, 128, 128, x, y, rotation);
  }
}
export class Skull extends Thing {
  constructor(x: number, y: number, rotation: number) {
    super(`${IMAGE_PATH}/skull.png`, 256, 256, x, y, rotation);
  }
}
export class Treasure extends Thing {
  constructor(x: number, y: number, rotation: number) {
    super(`${IMAGE_PATH}/treasure.png`, 256, 128, x, y, rotation);
  }
}
export class Hut extends Interactable {
  floorimg: CanvasImageSource | undefined;
  hutimg: CanvasImageSource | undefined;
  constructor(x: number, y: number, rotation: number) {
    super(`${IMAGE_PATH}/hut.png`, x, y, 512, 512, rotation);
    const floorelem = document.createElement("img");
    floorelem.src = `${IMAGE_PATH}/hutfloor.png`;
    floorelem.onload = () => {
      this.floorimg = floorelem;
    };
    const hutelem = document.createElement("img");
    hutelem.src = `${IMAGE_PATH}/hut.png`;
    hutelem.onload = () => {
      this.hutimg = hutelem;
    };
  }
  update(player: OwnPlayer, context: CanvasRenderingContext2D): void {
    if (this.overlap(player)) {
      this.image = this.floorimg;
    } else {
      this.image = this.hutimg;
    }
    this.draw(player, context);
  }
}
export class Coin extends Interactable {
  collected: boolean;
  constructor(x: number, y: number, rotation: number) {
    super(`${IMAGE_PATH}/coin.png`, x, y, 32, 32, rotation);
    this.collected = false;
  }
  update(player: OwnPlayer, context: CanvasRenderingContext2D): void {
    if (this.overlap(player)) {
      this.collected = true;
    }
    if (!this.collected) {
      this.draw(player, context);
    }
  }
}

export class GrassPatch {
  x: number;
  y: number;
  r: number;
  constructor(x: number, y: number, r: number) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
  draw(player: OwnPlayer, context: CanvasRenderingContext2D) {
    context.save();
    const x0 = context.canvas.width / 2 + (this.x - player.x) / player.size;
    const y0 = context.canvas.height / 2 + (this.y - player.y) / player.size;
    const r0 = this.r / player.size;
    const grd = context.createRadialGradient(x0, y0, 0, x0, y0, r0);
    grd.addColorStop(0, MAP_COLOR);
    grd.addColorStop(1, GRASSPATCH_CENTER);
    context.fillStyle = grd;
    context.beginPath();
    context.arc(x0, y0, r0, 0, 2 * Math.PI, false);
    context.fill();
    context.restore();
  }
  update(player: OwnPlayer, context: CanvasRenderingContext2D) {
    if (
      !Thing.isInscreen(player, context.canvas, {
        x: this.x,
        y: this.y,
        width: this.r,
        height: this.r,
      })
    ) {
      this.draw(player, context);
    }
  }
}
