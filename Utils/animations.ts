import {
  AnimationImageObject,
  Animation,
  SCALE,
  FADE,
  AnimationPathObject,
  AnimationPart,
  EasingFunction,
  MOVE,
  ROTATE,
} from "./animationlib";
import { IMAGE_PATH } from "./constants";

export function getAnimationById(id: number): Animation {
  //#region fireinthehole
  const fire = new AnimationImageObject(
    [
      new AnimationPart(new FADE(1), 0, 0.2, EasingFunction.easeOut),
      new AnimationPart(new MOVE(0, 20), 0.6, 0.3, EasingFunction.easeIn),
      new AnimationPart(new MOVE(0, -25), 0, 0.3, EasingFunction.easeOut),
      new AnimationPart(new SCALE(32, 32), 0, 0.3, EasingFunction.easeIn),
      new AnimationPart(new SCALE(12, 12), 0.6, 0.2, EasingFunction.easeIn),
    ],
    { x: 0, y: 10, width: 24, height: 24, rotation: 0, opacity: 0 },
    `${IMAGE_PATH}/Emotes/fire.svg`
  );
  const hole = new AnimationPathObject(
    [
      new AnimationPart(new SCALE(78, 39), 0, 0.1, EasingFunction.easeIn),
      new AnimationPart(new SCALE(64, 32), 0.1, 0.2, EasingFunction.easeIn),
      new AnimationPart(new ROTATE(25), 0.9, 0.3, EasingFunction.easeInOut),
      new AnimationPart(new ROTATE(-20), 1.2, 0.3, EasingFunction.easeInOut),
      new AnimationPart(new ROTATE(19), 1.5, 0.3, EasingFunction.easeInOut),
      new AnimationPart(new ROTATE(-15), 1.8, 0.3, EasingFunction.easeInOut),
      new AnimationPart(new ROTATE(11), 2.1, 0.3, EasingFunction.easeInOut),
      new AnimationPart(new ROTATE(-9), 2.4, 0.2, EasingFunction.easeInOut),
      new AnimationPart(new ROTATE(0), 2.6, 0.3, EasingFunction.easeInOut),
    ],
    {
      x: 0,
      y: -10,
      width: 64,
      height: 32,
      rotation: 0,
      opacity: 1,
    },
    (context, scale, obj) => {
      context.beginPath();
      context.ellipse(
        0,
        0,
        (obj.width / 2) * scale,
        (obj.height / 2) * scale,
        0,
        0,
        2 * Math.PI,
        false
      );
      context.fillStyle = "gray";
      context.fill();
      context.closePath();
      context.beginPath();
      context.ellipse(
        0,
        -2.5 * scale,
        (obj.width / 2) * scale,
        (obj.height / 2) * scale,
        0,
        0,
        2 * Math.PI,
        false
      );
      context.fillStyle = "black";
      context.fill();
      context.closePath();
    }
  );
  const holeCover = new AnimationPathObject(
    [
      new AnimationPart(new SCALE(78, 39), 0, 0.1, EasingFunction.easeIn),
      new AnimationPart(new SCALE(64, 32), 0.1, 0.2, EasingFunction.easeIn),
      new AnimationPart(new ROTATE(25), 0.9, 0.3, EasingFunction.easeInOut),
      new AnimationPart(new ROTATE(-20), 1.2, 0.3, EasingFunction.easeInOut),
      new AnimationPart(new ROTATE(19), 1.5, 0.3, EasingFunction.easeInOut),
      new AnimationPart(new ROTATE(-15), 1.8, 0.3, EasingFunction.easeInOut),
      new AnimationPart(new ROTATE(11), 2.1, 0.3, EasingFunction.easeInOut),
      new AnimationPart(new ROTATE(-9), 2.4, 0.2, EasingFunction.easeInOut),
      new AnimationPart(new ROTATE(0), 2.6, 0.3, EasingFunction.easeInOut),
    ],
    {
      x: 0,
      y: -10,
      width: 64,
      height: 32,
      rotation: 0,
      opacity: 1,
    },
    (context, scale, obj) => {
      context.beginPath();
      context.fillStyle = "white";
      context.rect(
        (obj.width / 2) * scale,
        0,
        -obj.width * scale,
        (obj.height * scale) / 2 + 18 * scale
      );
      context.ellipse(
        0,
        0,
        (obj.width / 2) * scale,
        (obj.height / 2) * scale,
        0,
        0,
        Math.PI,
        false
      );
      context.fill();
      context.closePath();
    }
  );

  const medic = new AnimationImageObject(
    [new AnimationPart(new SCALE(48, 48), 0, 0.5, EasingFunction.easeOut)],
    {
      x: 0,
      y: -10,
      opacity: 1,
      width: 8,
      height: 8,
      rotation: 0,
    },
    `${IMAGE_PATH}/Emotes/cross.svg`
  );

  const crowbar = new AnimationImageObject(
    [
      new AnimationPart(new ROTATE(-10), 0, 0.3, EasingFunction.easeOut),
      new AnimationPart(new ROTATE(50), 0.3, 0.5, EasingFunction.easeOut),
      new AnimationPart(new ROTATE(-10), 0.8, 0.3, EasingFunction.easeOut),
      new AnimationPart(new ROTATE(50), 1.1, 0.5, EasingFunction.easeOut),
      new AnimationPart(new ROTATE(-10), 1.6, 0.3, EasingFunction.easeOut),
      new AnimationPart(new ROTATE(50), 1.9, 0.5, EasingFunction.easeOut),
    ],
    { x: -5, y: -5, rotation: 50, opacity: 1, width: 48, height: 48 },
    `${IMAGE_PATH}/Emotes/crowbar.svg`
  );
  const wall = new AnimationPathObject(
    [],
    {
      x: 15,
      y: 0,
      rotation: 0,
      opacity: 1,
      width: 2.5,
      height: 60,
    },
    (context, scale, obj) => {
      context.fillStyle = "gray";
      context.translate((-obj.width / 2) * scale, (-obj.height / 2) * scale);
      context.fillRect(0, 0, obj.width * scale, obj.height * scale);
    }
  );

  switch (id) {
    case 1:
      return new Animation([hole, fire, holeCover]);
    case 2:
      return new Animation([medic]);
    case 3:
      return new Animation([crowbar, wall]);
    default:
      return new Animation([]);
  }
}
export let chatbubble: CanvasImageSource | undefined = undefined;
const chatbubbleElem = document.createElement("img");
chatbubbleElem.src = `${IMAGE_PATH}/Emotes/chatbubble.svg`;
chatbubbleElem.onload = () => {
  chatbubble = chatbubbleElem;
};
