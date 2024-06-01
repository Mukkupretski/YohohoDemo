import { OwnPlayer, Player } from "./playerclasses";
import { Obj } from "./playermiscclasses";
import {
  GRASSPATCH_CENTER,
  IMAGE_PATH,
  MAP_COLOR,
  NO_RENDER_COLOR,
} from "./constants";
import { SerializedGrassPatch, SerializedThing } from "./serialtypes";
import { ThingTypes } from "./enums";
import { Picture } from "./othertypes";
import { ImageEnum, getImage } from "./Images";

export class Thing {
  width: number;
  height: number;
  x: number;
  y: number;
  rotation: number;
  thingType: ThingTypes;
  picture: Picture;
  constructor(thing: SerializedThing) {
    this.thingType = thing.thingType;
    this.width = thing.width;
    this.height = thing.height;
    this.x = thing.x;
    this.y = thing.y;
    this.rotation = thing.rotation;
    this.picture = thing.picture;
  }
  static isInscreen(
    player: OwnPlayer,
    canvas: HTMLCanvasElement,
    obj: Player | Thing | Obj
  ): boolean {
    let scale = player.size;
    if (obj instanceof Player) {
      scale *= obj.size;
    }
    return (
      Math.abs(player.x - obj.x) - obj.width / 2 < (scale * canvas.width) / 2 &&
      Math.abs(player.y - obj.y) - obj.height / 2 < (scale * canvas.height) / 2
    );
  }
  draw(player: OwnPlayer, context: CanvasRenderingContext2D): void {
    if (!Thing.isInscreen(player, context.canvas, this)) return;
    context.save();
    Thing.doTranslate(player, context, this);
    context.rotate(((-1 * Math.PI) / 180) * this.rotation);
    const img = getImage(this.picture.image);
    if (img) {
      context.drawImage(
        img,
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
    obj: Thing | Player | Obj
  ) {
    const scale: number = 1 / player.size;
    //1. Put top corner to center
    //2. Put center of the object to center (the width of object is obj.width*scale so we divide that with 2 and same with height)
    //3. Move respectively to the own player's position (scaled by scale)
    //4. Now the object would be at correct place if scale was 1 but else the top corner is offset by width*(1-scale)/2 so we fix that (same with height)
    //5. The square is rendered at ((-width*scale)/2,(-height*scale)/2) for rotation so we fix that offset
    //Note that 2. and 5. cancel each other
    context.translate(
      //X
      context.canvas.width / 2 + (obj.x - player.x) * scale,
      //Y
      context.canvas.height / 2 + (obj.y - player.y) * scale
    );
  }
  static getSerializedThing(thing: Thing): SerializedThing {
    return {
      x: thing.x,
      y: thing.y,
      rotation: thing.rotation,
      width: thing.width,
      height: thing.height,
      thingType: thing.thingType,
      picture: thing.picture,
    };
  }
  static collide(
    thing1: Thing | SerializedThing | Obj,
    thing2: Thing | SerializedThing | Obj
  ): boolean {
    return (
      (thing1.width + thing2.width) / 2 > Math.abs(thing1.x - thing2.x) &&
      (thing1.height + thing2.height) / 2 > Math.abs(thing1.y - thing2.y)
    );
  }
}
export abstract class Interactable extends Thing {
  constructor(
    thingType: ThingTypes,
    width: number,
    height: number,
    x: number,
    y: number,
    rotation: number,
    picture: Picture
  ) {
    super({
      thingType: thingType,
      width: width,
      height: height,
      x: x,
      y: y,
      rotation: rotation,
      picture: picture,
    });
  }
  overlap(player: OwnPlayer): boolean {
    return (
      (this.width / player.size + player.width) / 2 >
        Math.abs(this.x - player.x) / player.size &&
      (this.height / player.size + player.height) / 2 >
        Math.abs(this.y - player.y) / player.size
    );
  }
  abstract update(player: OwnPlayer, context: CanvasRenderingContext2D): void;
}

export abstract class LayerSwitcher extends Interactable {
  onForeground: boolean;
  constructor(
    thingType: ThingTypes,
    width: number,
    height: number,
    x: number,
    y: number,
    rotation: number,
    picture: Picture
  ) {
    super(thingType, width, height, x, y, rotation, picture);
    this.onForeground = false;
  }
  abstract update(player: OwnPlayer, context: CanvasRenderingContext2D): void;
}

export class Hut extends LayerSwitcher {
  constructor(thing: SerializedThing) {
    super(
      ThingTypes.HUT,
      thing.width,
      thing.height,
      thing.x,
      thing.y,
      thing.rotation,
      thing.picture
    );
  }
  update(player: OwnPlayer, context: CanvasRenderingContext2D): void {
    if (this.overlap(player)) {
      this.picture = { image: ImageEnum.HUTFLOOR };
      this.onForeground = false;
    } else {
      this.picture = { image: ImageEnum.HUT };
      this.onForeground = true;
    }
    this.draw(player, context);
  }
}

export class GrassPatch {
  x: number;
  y: number;
  r: number;
  constructor(grassPatch: SerializedGrassPatch) {
    this.x = grassPatch.x;
    this.y = grassPatch.y;
    this.r = grassPatch.width / 2;
  }
  draw(player: OwnPlayer, context: CanvasRenderingContext2D) {
    context.save();
    const x0 = context.canvas.width / 2 + (this.x - player.x) / player.size;
    const y0 = context.canvas.height / 2 + (this.y - player.y) / player.size;
    const r0 = this.r / player.size;
    const grd = context.createRadialGradient(x0, y0, 0, x0, y0, r0);
    grd.addColorStop(0, GRASSPATCH_CENTER);
    grd.addColorStop(1, MAP_COLOR);
    context.fillStyle = grd;
    context.beginPath();
    context.arc(x0, y0, r0, 0, 2 * Math.PI, false);
    context.fill();
    context.restore();
  }
  update(player: OwnPlayer, context: CanvasRenderingContext2D) {
    if (
      Thing.isInscreen(
        player,
        context.canvas,
        GrassPatch.getSerializedGrassPatch(this)
      )
    ) {
      this.draw(player, context);
    }
  }
  static getSerializedGrassPatch(grassPatch: GrassPatch): SerializedGrassPatch {
    return {
      x: grassPatch.x,
      y: grassPatch.y,
      width: grassPatch.r * 2,
      height: grassPatch.r * 2,
    };
  }
}
