import { ImageEnum, getImage } from "./Utils/Images";
const imagesToLoad: ImageEnum[] = [
  ImageEnum.CHATBUBBLE,
  ImageEnum.FIRE,
  ImageEnum.KNIFE,
  ImageEnum.CROSS,
  ImageEnum.CROWBAR,
  ImageEnum.AMOGUS,
  ImageEnum.AMOGUSHAND,
];

export function loadImages() {
  imagesToLoad.forEach((img) => {
    getImage(img);
  });
  console.log("images loaded");
}
