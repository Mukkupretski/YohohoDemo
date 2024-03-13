export abstract class Player {
  x: number;
  y: number;
  size: number;
  width: number;
  height: number;
  image: CanvasImageSource | undefined;
  constructor(x: number, y: number, size: number, skin: string) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.width = 256;
    this.height = 256;
    const skinImage = document.createElement("img");
    skinImage.src = `Images/${skin}.png`;
    skinImage.onload = () => {
      this.image = skinImage;
    };
  }
}

export class OwnPlayer extends Player {
  constructor(
    x: number,
    y: number,
    size: number,
    skin: string,
    coins: number,
    width: number,
    height: number,
    rotation: number,
    health: number
  ) {
    super(x, y, size, skin);
  }
}
export class OtherPlayer extends Player {
  constructor(
    x: number,
    y: number,
    size: number,
    skin: string,
    width: number,
    height: number,
    rotation: number,
    health: number,
    id: string
  ) {
    super(x, y, size, skin);
  }
  draw(player: OwnPlayer, context: CanvasRenderingContext2D): void {
    context.save();
    context.translate(
      context.canvas.width / 2 -
        player.width / 2 +
        (this.width - this.width / player.size) / 2,
      context.canvas.height / 2 -
        player.height / 2 +
        (this.height - this.height / player.size) / 2
    );
    if (this.image) {
      context.drawImage(
        this.image,
        (this.x - player.x) / player.size,
        (this.y - player.y) / player.size,
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
}
