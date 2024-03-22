export enum Skins {
  AMOGUS,
  NORMAL,
  PYTHAGORAS,
}

export enum Swords {
  PYTHAGORAS,
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
