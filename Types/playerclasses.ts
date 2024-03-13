export abstract class Player {
  x: number;
  y: number;
  size: number;
  width: number;
  height: number;
  constructor(
    x: number,
    y: number,
    size: number,
    width: number,
    height: number
  ) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.width = width;
    this.height = height;
  }
}

export class OwnPlayer extends Player {
  constructor(
    x: number,
    y: number,
    size: number,
    width: number,
    height: number
  ) {
    super(x, y, size, width, height);
  }
}
export class OtherPlayer extends Player {
  constructor(
    x: number,
    y: number,
    size: number,
    width: number,
    height: number
  ) {
    super(x, y, size, width, height);
  }
}
