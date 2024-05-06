export abstract class AnimationType {
  abstract updateThing(
    obj: AnimationObject,
    part: AnimationPart,
    t: number
  ): void;
}
export class SCALE extends AnimationType {
  initialX: number | undefined;
  initialY: number | undefined;
  scaleX: number;
  scaleY: number;
  constructor(scaleX: number, scaleY: number) {
    super();
    this.scaleX = scaleX;
    this.scaleY = scaleY;
  }
  updateThing(obj: AnimationObject, part: AnimationPart, t: number): void {
    if (t >= part.start && t <= part.start + part.duration) {
      if (this.initialX == undefined || this.initialY == undefined) {
        this.initialX = obj.width;
        this.initialY = obj.height;
      }
      const easing = part.easing(t - part.start, part.duration);
      obj.width = this.initialX * (1 - easing) + this.scaleX * easing;
      obj.height = this.initialY * (1 - easing) + this.scaleY * easing;
    }
  }
}
export class MOVE extends AnimationType {
  initialX: number | undefined;
  initialY: number | undefined;
  moveX: number;
  moveY: number;
  constructor(moveX: number, moveY: number) {
    super();
    this.moveX = moveX;
    this.moveY = moveY;
  }
  updateThing(obj: AnimationObject, part: AnimationPart, t: number): void {
    if (t >= part.start && t <= part.start + part.duration) {
      if (this.initialX == undefined || this.initialY == undefined) {
        this.initialX = obj.x;
        this.initialY = obj.y;
      }
      const easing = part.easing(t - part.start, part.duration);
      obj.x = this.initialX * (1 - easing) + this.moveX * easing;
      obj.y = this.initialY * (1 - easing) + this.moveY * easing;
    }
  }
}
export class ROTATE extends AnimationType {
  initialRot: number | undefined;
  targetRot: number;
  constructor(targetRot: number) {
    super();
    this.targetRot = targetRot;
  }
  updateThing(obj: AnimationObject, part: AnimationPart, t: number): void {
    if (t >= part.start && t <= part.start + part.duration) {
      if (this.initialRot == undefined) {
        this.initialRot = obj.rotation;
      }
      const easing = part.easing(t - part.start, part.duration);
      obj.rotation = this.initialRot * (1 - easing) + this.targetRot * easing;
    }
  }
}
export class FADE extends AnimationType {
  initialFade: number | undefined;
  targetFade: number;
  constructor(targetFade: number) {
    super();
    this.targetFade = targetFade;
  }
  updateThing(obj: AnimationObject, part: AnimationPart, t: number): void {
    if (t >= part.start && t <= part.start + part.duration) {
      if (this.initialFade == undefined) {
        this.initialFade = obj.opacity;
      }
      const easing = part.easing(t - part.start, part.duration);
      obj.opacity = this.initialFade * (1 - easing) + this.targetFade * easing;
    }
  }
}
export class TOGGLE extends AnimationType {
  toggled: boolean;
  mode: "visible" | "invisible";
  constructor(mode: "visible" | "invisible") {
    super();
    this.mode = mode;
    this.toggled = false;
  }
  updateThing(obj: AnimationObject, part: AnimationPart, t: number): void {
    if (t >= part.start && !this.toggled) {
      obj.opacity = this.mode == "visible" ? 1 : 0;
    }
  }
}

export class AnimationPart {
  type: AnimationType;
  start: number;
  duration: number;
  easing: Easing;
  constructor(
    type: AnimationType,
    start: number,
    duration: number,
    easing: Easing
  ) {
    this.duration = duration;
    this.start = start;
    this.easing = easing;
    this.type = type;
  }
  update(obj: AnimationObject, t: number): void {
    this.type.updateThing(obj, this, t);
  }
}

type Easing = (t: number, duration: number) => number;

export namespace EasingFunction {
  export function linear(t: number, duration: number): number {
    return t / duration;
  }
  export function easeIn(t: number, duration: number): number {
    return (t / duration) ** 2;
  }
  export function easeInOut(t: number, duration: number): number {
    return (3 - (2 * t) / duration) * (t / duration) ** 2;
  }
  export function easeOut(t: number, duration: number): number {
    return (t / duration) * (2 - t / duration);
  }
}

export abstract class AnimationObject {
  animationParts: AnimationPart[];
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  initialx: number;
  initialy: number;
  initialwidth: number;
  initialheight: number;
  initialrotation: number;
  initialopacity: number;
  animationStart: number | undefined;
  constructor(
    animationParts: AnimationPart[],
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number,
    opacity: number
  ) {
    this.rotation = rotation;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.animationParts = animationParts;
    this.opacity = opacity;

    this.initialrotation = rotation;
    this.initialx = x;
    this.initialy = y;
    this.initialwidth = width;
    this.initialheight = height;
    this.initialopacity = opacity;
  }
  abstract drawSelf(context: CanvasRenderingContext2D, scale: number): void;

  update(context: CanvasRenderingContext2D, scale: number, t?: number): void {
    if (!this.animationStart) {
      this.animationStart = Date.now();
    }
    const time = t ?? (Date.now() - this.animationStart!) / 1000;
    this.animationParts.forEach((p) => {
      p.update(this, time);
    });
    this.drawSelf(context, scale);
  }
  reset() {
    this.animationStart = Date.now();
    this.x = this.initialx;
    this.rotation = this.initialrotation;
    this.y = this.initialy;
    this.width = this.initialwidth;
    this.height = this.initialheight;
    this.opacity = this.initialopacity;
  }
}

export class AnimationImageObject extends AnimationObject {
  imageSrc: CanvasImageSource | undefined;
  constructor(
    animationParts: AnimationPart[],
    {
      x,
      y,
      width,
      height,
      rotation,
      opacity,
    }: {
      x: number;
      y: number;
      width: number;
      height: number;
      rotation: number;
      opacity: number;
    },
    imagePath: string
  ) {
    super(animationParts, x, y, width, height, rotation, opacity);
    const img = document.createElement("img");
    img.src = imagePath;
    img.onload = () => {
      this.imageSrc = img;
    };
  }
  drawSelf(context: CanvasRenderingContext2D, scale: number): void {
    //Assuming translation is such that the thing is in the middle of chatbubble
    //Emote area: 64x64px
    context.save();
    context.translate(this.x * scale, this.y * scale);
    context.rotate((-this.rotation / 180) * Math.PI);
    context.globalAlpha = this.opacity;
    if (this.imageSrc) {
      context.drawImage(
        this.imageSrc,
        (-this.width / 2) * scale,
        (-this.height / 2) * scale,
        this.width * scale,
        this.height * scale
      );
    } else {
      context.fillStyle = "black";
      context.fillRect(
        (-this.width / 2) * scale,
        (-this.height / 2) * scale,
        this.width * scale,
        this.height * scale
      );
    }
    context.restore();
  }
}
export class AnimationPathObject extends AnimationObject {
  drawFunc: (
    context: CanvasRenderingContext2D,
    scale: number,
    obj: AnimationPathObject
  ) => void;
  constructor(
    animationParts: AnimationPart[],
    {
      x,
      y,
      width,
      height,
      rotation,
      opacity,
    }: {
      x: number;
      y: number;
      width: number;
      height: number;
      rotation: number;
      opacity: number;
    },
    drawFunc: (
      context: CanvasRenderingContext2D,
      scale: number,
      obj: AnimationPathObject
    ) => void
  ) {
    super(animationParts, x, y, width, height, rotation, opacity);
    this.drawFunc = drawFunc;
  }
  drawSelf(context: CanvasRenderingContext2D, scale: number): void {
    //Assuming translation is such that the thing is in the middle of chatbubble
    //Emote area: 64x64px
    context.save();
    context.translate(this.x * scale, this.y * scale);
    context.rotate((-this.rotation / 180) * Math.PI);
    context.globalAlpha = this.opacity;
    this.drawFunc(context, scale, this);
    context.restore();
  }
}
export class Animation {
  animationObjects: AnimationObject[];
  time: number;
  constructor(animationObjects: AnimationObject[]) {
    this.animationObjects = animationObjects;
    this.time = animationObjects.reduce((prev, obj) => {
      return Math.max(
        prev,
        obj.animationParts.reduce((prev, part) => {
          return Math.max(prev, part.start + part.duration);
        }, 0)
      );
    }, 0);
  }
  update(context: CanvasRenderingContext2D, scale: number) {
    this.animationObjects.forEach((obj) => {
      obj.update(context, scale);
    });
  }
  drawFrame(context: CanvasRenderingContext2D, scale: number, t: number): void {
    this.animationObjects.forEach((obj) => {
      obj.update(context, scale, t);
    });
  }
  restart() {
    this.animationObjects.forEach((obj) => {
      obj.reset();
    });
  }
}
