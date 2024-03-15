import { OwnPlayer } from "./playerclasses";

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
    context.translate(
      context.canvas.width / 2 -
        player.width / 2 +
        (this.width - this.width / player.size) / 2 +
        (this.x - player.x) / player.size +
        this.width / player.size / 2,
      context.canvas.height / 2 -
        player.height / 2 +
        (this.height - this.height / player.size) / 2 +
        (this.y - player.y) / player.size +
        this.height / player.size / 2
    );
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
    super("Images/tree.png", 384, 384, x, y, rotation);
  }
}
export class Bush extends Thing {
  constructor(x: number, y: number, rotation: number) {
    super("Images/bush.png", 128, 128, x, y, rotation);
  }
}
export class Skull extends Thing {
  constructor(x: number, y: number, rotation: number) {
    super("Images/skull.png", 256, 256, x, y, rotation);
  }
}
export class Treasure extends Thing {
  constructor(x: number, y: number, rotation: number) {
    super("Images/treasure.png", 256, 128, x, y, rotation);
  }
}
export class Hut extends Interactable {
  floorimg: CanvasImageSource | undefined;
  hutimg: CanvasImageSource | undefined;
  constructor(x: number, y: number, rotation: number) {
    super("Images/hut.png", x, y, 512, 512, rotation);
    const floorelem = document.createElement("img");
    floorelem.src = "Images/hutfloor.png";
    floorelem.onload = () => {
      this.floorimg = floorelem;
    };
    const hutelem = document.createElement("img");
    hutelem.src = "Images/hut.png";
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
    super("Images/coin.png", x, y, 32, 32, rotation);
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
