export abstract class Player {
  x: number;
  y: number;
  size: number;
  constructor(x: number, y: number, size: number) {
    this.x = x;
    this.y = y;
    this.size = size;
  }
}

export class OwnPlayer extends Player {
  constructor(x: number, y: number, size: number) {
    super(x, y, size);
  }
}
export class OtherPlayer extends Player {
  constructor(x: number, y: number, size: number) {
    super(x, y, size);
  }
}
