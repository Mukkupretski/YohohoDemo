import { OwnPlayer } from "./playerclasses";

abstract class Thing {
  imageSrc: string;
  width: number;
  height: number;
  x: number;
  y: number;
  constructor(
    imageSrc: string,
    width: number,
    height: number,
    x: number,
    y: number
  ) {
    this.imageSrc = imageSrc;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
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
  }
  update(player: OwnPlayer, context: CanvasRenderingContext2D): void {
    this.draw(player, context);
  }
}
abstract class Interactable extends Thing {
  constructor(
    imageSrc: string,
    width: number,
    height: number,
    x: number,
    y: number
  ) {
    super(imageSrc, width, height, x, y);
  }
  abstract overlap(player: OwnPlayer): boolean;
  abstract interact(player: OwnPlayer, context: CanvasRenderingContext2D): void;
}
class Tree extends Thing {
  constructor(x: number, y: number) {
    super("Images/tree.png", 384, 384, x, y);
  }
  update(player: OwnPlayer, context: CanvasRenderingContext2D): void {}
}
