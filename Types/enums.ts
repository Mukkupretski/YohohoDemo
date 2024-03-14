export enum Skins {
  AMOGUS,
}

export enum Swords {
  DEFAULT,
}

export function getSkinPath(skin: Skins): [number, number] {
  let pos: [number, number];
  switch (skin) {
    case Skins.AMOGUS:
      pos = [0, 0];
  }
  return pos;
}
export function getSwordPath(sword: Swords): [number, number] {
  let pos: [number, number];
  switch (sword) {
    case Swords.DEFAULT:
      pos = [0, 0];
  }
  return pos;
}
