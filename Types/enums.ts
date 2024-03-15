export enum Skins {
  AMOGUS,
  NORMAL,
}

export enum Swords {
  DEFAULT,
}

export function getSkinPos(skin: Skins): [number, number] {
  let pos: [number, number];
  switch (skin) {
    case Skins.AMOGUS:
      pos = [0, 0];
    case Skins.NORMAL:
      pos = [1, 0];
  }
  return pos;
}
export function getSwordPos(sword: Swords): [number, number] {
  let pos: [number, number];
  switch (sword) {
    case Swords.DEFAULT:
      pos = [0, 0];
  }
  return pos;
}
