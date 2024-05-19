import { ImageEnum } from "./Images";

type Keys = {
  w: boolean;
  d: boolean;
  s: boolean;
  a: boolean;
  spacebartime: number;
  spacebarhold: number;
};
type Picture = {
  image: ImageEnum;
  coords?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};
