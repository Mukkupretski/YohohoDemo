export enum Skins {
  AMOGUS,
  NORMAL,
  PYTHAGORAS,
  PROCHARACTER,
  PIRATE,
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
    case Skins.PYTHAGORAS:
      pos = [2, 0];
    case Skins.PROCHARACTER:
      pos = [3, 0];
    case Skins.PIRATE:
      pos = [0, 1];
  }
  return pos;
}
export function getSwordPos(sword: Swords): [number, number] {
  let pos: [number, number];
  switch (sword) {
    case Swords.PYTHAGORAS:
      pos = [0, 0];
  }
  return pos;
}
