import { IMAGE_PATH } from "./constants";

export enum ImageEnum {
  BUSH1 = "Other/bush1.svg",
  BUSH2 = "Other/bush2.svg",
  ROCK = "Other/rock.svg",
  TREE = "Other/tree.svg",
  SKULL = "Other/skull.svg",
  TREASURE = "Other/treasure.png",
  COIN = "Other/coin.png",
  HUT = "Other/hut.svg",
  HUTFLOOR = "Other/hutfloor.svg",
  SKIN = "skinsheet.svg",
  SWORD = "swordsheet.svg",
  HAND = "handsheet.svg",
  FIRE = "Emotes/fire.svg",
  KNIFE = "Emotes/knife.svg",
  CROWBAR = "Emotes/crowbar.svg",
  CROSS = "Emotes/cross.svg",
  AMOGUS = "Emotes/amogus.svg",
  AMOGUSHAND = "Emotes/amogushand.svg",
  CHATBUBBLE = "Emotes/chatbubble.svg",
}

const imageMap = new Map<ImageEnum, CanvasImageSource | "loading">();

export function getImage(image: ImageEnum): CanvasImageSource | undefined {
  if (!imageMap.has(image)) {
    const img = document.createElement("img");
    img.src = `${IMAGE_PATH}/${image}`;
    imageMap.set(image, "loading");
    img.onload = () => {
      imageMap.set(image, img);
    };
    return undefined;
  }
  const img = imageMap.get(image);
  if (img === "loading") {
    return undefined;
  }
  return img;
}
