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
  let pos: [number, number] = [0, 0];

  if (skin == Skins.AMOGUS) {
    pos = [0, 0];
  } else if (skin == Skins.NORMAL) {
    pos = [1, 0];
  } else if (skin == Skins.PYTHAGORAS) {
    pos = [2, 0];
  } else if (skin == Skins.PROCHARACTER) {
    pos = [3, 0];
  } else if (skin == Skins.PIRATE) {
    pos = [0, 1];
  }

  return pos;
}
export function getSwordPos(sword: Swords): [number, number] {
  let pos: [number, number] = [0, 0];
  if (sword == Swords.PYTHAGORAS) {
    pos = [0, 0];
  }
  return pos;
}
