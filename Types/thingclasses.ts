import { OwnPlayer, Player } from "./playerclasses";
import { Obj } from "./playermiscclasses";

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
  isInscreen(player: OwnPlayer, canvas: HTMLCanvasElement): boolean {
    return (
      Math.abs(player.x - this.x) - this.width / 2 <
        (player.size * canvas.width) / 2 &&
      Math.abs(player.y - this.y) - this.height / 2 <
        (player.size * canvas.height) / 2
    );
  }
  draw(player: OwnPlayer, context: CanvasRenderingContext2D): void {
    if (!this.isInscreen(player, context.canvas)) return;
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
      context.fillStyle = "black";
      context.fillRect(
        (this.x - player.x) / player.size,
        (this.y - player.y) / player.size,
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
    obj: Thing | Player | Obj
  ) {
    //1. Put to center
    //2. Move respectively to the own player's position (scaled by own player's size)
    //3. Now the corner is in the correct place (same as if player's size was 1) but we want center to be in correct place
    //So we calculate the 'gap' between current size and normal size and divide it by two to center the square
    //4. The square is rendered at ((-width/player.size)/2,(-height/player.size)/2) for rotation so we fix that offset
    context.translate(
      //X
      context.canvas.width / 2 -
        player.width / 2 +
        (obj.width - obj.width / player.size) / 2 +
        (obj.x - player.x) / player.size +
        obj.width / player.size / 2,
      //Y
      context.canvas.height / 2 -
        player.height / 2 +
        (obj.height - obj.height / player.size) / 2 +
        (obj.y - player.y) / player.size +
        obj.height / player.size / 2
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
    super("../Images/tree.png", 384, 384, x, y, rotation);
  }
}
export class Bush extends Thing {
  constructor(x: number, y: number, rotation: number) {
    super("../Images/bush.png", 128, 128, x, y, rotation);
  }
}
export class Skull extends Thing {
  constructor(x: number, y: number, rotation: number) {
    super("../Images/skull.png", 256, 256, x, y, rotation);
  }
}
export class Treasure extends Thing {
  constructor(x: number, y: number, rotation: number) {
    super("../Images/treasure.png", 256, 128, x, y, rotation);
  }
}
export class Hut extends Interactable {
  floorimg: CanvasImageSource | undefined;
  hutimg: CanvasImageSource | undefined;
  constructor(x: number, y: number, rotation: number) {
    super("../Images/hut.png", x, y, 512, 512, rotation);
    const floorelem = document.createElement("img");
    floorelem.src = "../Images/hutfloor.png";
    floorelem.onload = () => {
      this.floorimg = floorelem;
    };
    const hutelem = document.createElement("img");
    hutelem.src = "../Images/hut.png";
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
    super("../Images/coin.png", x, y, 32, 32, rotation);
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
