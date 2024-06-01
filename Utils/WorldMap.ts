import { ImageEnum } from "./Images";
import { ThingTypes } from "./enums";
import { Obj } from "./playermiscclasses";
import {
  SerializedWorldMap,
  SerializedThing,
  SerializedGrassPatch,
} from "./serialtypes";
import { GrassPatch, Hut, LayerSwitcher, Thing } from "./thingclasses";

export default class WorldMap {
  staticForeground: Thing[];
  dynamicForeground: Thing[];
  staticBackground: Thing[];
  dynamicBackground: Thing[];
  staticChanging: LayerSwitcher[];
  grass: GrassPatch[];
  size: number;
  constructor(map: SerializedWorldMap) {
    this.grass = map.grass.map((gr) => {
      return new GrassPatch(gr);
    });
    this.staticBackground = map.staticBackground.map((obj) => {
      return new Thing(obj);
    });
    this.staticForeground = map.staticForeground.map((obj) => {
      return new Thing(obj);
    });
    this.dynamicBackground = map.dynamicBackground.map((obj) => {
      return new Thing(obj);
    });
    this.dynamicForeground = map.dynamicForeground.map((obj) => {
      return new Thing(obj);
    });
    this.staticChanging = map.staticChanging.map((obj) => {
      if (obj.thingType == ThingTypes.HUT) {
        return new Hut(obj);
      }
      return new Hut(obj);
    });
    this.size = map.size;
  }
  updateMap(
    dynamicBackground: SerializedThing[],
    dynamicForeground: SerializedThing[]
  ) {
    this.dynamicBackground = dynamicBackground.map((thing) => new Thing(thing));
    this.dynamicForeground = dynamicForeground.map((thing) => new Thing(thing));
  }
  drawMinimap(context: CanvasRenderingContext2D): void {}

  // static generateMap(size: number): SerializedWorldMap {
  //   const map: SerializedWorldMap = {
  //     grass: [],
  //     staticBackground: [],
  //     staticChanging: [],
  //     staticForeground: [],
  //     dynamicBackground: [],
  //     dynamicForeground: [],
  //     size: size,
  //   };
  //   //generating grasspatches
  //   outerLoop: for (let i = 0; i < Math.floor(size / 100); i++) {
  //     const r = this.getRandomInteger(64, 1024);
  //     const randomPos: [number, number] = [
  //       Math.round(this.getRandomInteger(0, size)),
  //       Math.round(this.getRandomInteger(0, size)),
  //     ];
  //     if (
  //       randomPos[0] - r < 0 ||
  //       randomPos[0] + r > size ||
  //       randomPos[1] - r < 0 ||
  //       randomPos[1] + r > size
  //     ) {
  //       continue outerLoop;
  //     }
  //     const patch: SerializedGrassPatch = {
  //       x: randomPos[0],
  //       y: randomPos[1],
  //       width: r,
  //       height: r,
  //     };
  //     map.grass.push(patch);
  //   }

  //   //generating buildings
  //   for (let i = 0; i < 3; i++) {
  //     for (let j = 0; i < 3; i++) {
  //       if (this.getRandomInteger(0, 5) < 4 && (i != 1 || j != 1)) {
  //         const xRange = this.getHutRange(i);
  //         const yRange = this.getHutRange(j);
  //         const hutX = this.getRandomInteger(
  //           Math.round(xRange[0] * size),
  //           Math.round(xRange[1] * size)
  //         );
  //         const hutY = this.getRandomInteger(
  //           Math.round(yRange[0] * size),
  //           Math.round(yRange[1] * size)
  //         );
  //         const hut: SerializedThing = {
  //           x: hutX,
  //           y: hutY,
  //           width: 512,
  //           height: 512,
  //           thingType: ThingTypes.HUT,
  //           rotation: this.getRandomInteger(0, 3) * 90,
  //         };
  //         map.staticChanging.push(hut);
  //       }
  //     }
  //   }
  //   //generationg rocks
  //   outerLoop: while (map.dynamicBackground.length < Math.floor(size / 400)) {
  //     const randomPos: [number, number] = [
  //       Math.round(this.getRandomInteger(0, size)),
  //       Math.round(this.getRandomInteger(0, size)),
  //     ];

  //     const treasure: SerializedThing = {
  //       x: randomPos[0],
  //       y: randomPos[1],
  //       width: 256,
  //       height: 128,
  //       thingType: ThingTypes.TREASURE,
  //       rotation: this.getRandomInteger(0, 1) * 180,
  //     };
  //     for (let hut of map.staticChanging) {
  //       if (Thing.collide(hut, treasure)) {
  //         continue outerLoop;
  //       }
  //     }
  //     for (let plant of map.staticForeground) {
  //       if (Thing.collide(plant, treasure)) {
  //         continue outerLoop;
  //       }
  //     }
  //     map.dynamicBackground.push(treasure);
  //   }
  //   //generating plants
  //   outerLoop: for (
  //     let i = 0;
  //     i <
  //     Math.floor(
  //       ((size / ((384 + 128 + 128) / 3)) * size) / ((384 + 128 + 128) / 3) / 10
  //     );
  //     i++
  //   ) {
  //     const randomPos: [number, number] = [
  //       Math.round(this.getRandomInteger(0, size)),
  //       Math.round(this.getRandomInteger(0, size)),
  //     ];
  //     const plantType: ThingTypes = [
  //       ThingTypes.BUSH1,
  //       ThingTypes.BUSH2,
  //       ThingTypes.TREE,
  //     ][1];
  //     const plantSize: number = plantType === ThingTypes.TREE ? 384 : 128;
  //     const plant: SerializedThing = {
  //       x: randomPos[0],
  //       y: randomPos[1],
  //       width: plantSize,
  //       height: plantSize,
  //       thingType: plantType,
  //       rotation: this.getRandomInteger(0, 3) * 90,
  //     };
  //     for (let hut of map.staticChanging) {
  //       if (Thing.collide(hut, plant)) {
  //         continue outerLoop;
  //       }
  //     }
  //     for (let plt of map.staticForeground) {
  //       if (Thing.collide(plt, plant)) {
  //         continue outerLoop;
  //       }
  //     }
  //     for (let plt of map.staticBackground) {
  //       if (Thing.collide(plt, plant)) {
  //         continue outerLoop;
  //       }
  //     }
  //     (plantType === ThingTypes.TREE
  //       ? map.staticForeground
  //       : map.staticBackground
  //     ).push(plant);
  //   }

  //   //generating treasures
  //   outerLoop: while (map.dynamicBackground.length < Math.floor(size / 400)) {
  //     const randomPos: [number, number] = [
  //       Math.round(this.getRandomInteger(0, size)),
  //       Math.round(this.getRandomInteger(0, size)),
  //     ];

  //     const treasure: SerializedThing = {
  //       x: randomPos[0],
  //       y: randomPos[1],
  //       width: 256,
  //       height: 128,
  //       thingType: ThingTypes.TREASURE,
  //       rotation: this.getRandomInteger(0, 1) * 180,
  //     };
  //     for (let hut of map.staticChanging) {
  //       if (Thing.collide(hut, treasure)) {
  //         continue outerLoop;
  //       }
  //     }
  //     for (let plant of map.staticForeground) {
  //       if (Thing.collide(plant, treasure)) {
  //         continue outerLoop;
  //       }
  //     }
  //     map.dynamicBackground.push(treasure);
  //   }

  //   return map;
  // }

  static generateCoins(
    x: number,
    y: number,
    amount: number,
    distance: number,
    map: SerializedWorldMap
  ) {
    for (let i = 0; i < amount; i++) {
      const d = distance * (1 / (1 + Math.exp(-Math.random() * 8 + 5)));
      const angle = WorldMap.getRandomInteger(0, 359);
      const coin: SerializedThing = {
        x: x + d * Math.cos((angle / 180) * Math.PI),
        y: y - d * Math.sin((angle / 180) * Math.PI),
        width: 32,
        height: 32,
        rotation: 30 * WorldMap.getRandomInteger(0, 11),
        thingType: ThingTypes.COIN,
        picture: { image: ImageEnum.COIN },
      };
      map.dynamicBackground.push(coin);
    }
  }

  static generateHut(x: number, y: number, map: SerializedWorldMap): boolean {
    const hut: SerializedThing = {
      x: x,
      y: y,
      width: 784,
      height: 784,
      thingType: ThingTypes.HUT,
      picture: { image: ImageEnum.HUT },
      rotation: WorldMap.getRandomInteger(0, 1) * 180,
    };
    if (WorldMap.checkCollision(hut, map)) {
      map.staticChanging.push(hut);
      return true;
    }
    return false;
  }
  static generateBush(x: number, y: number, map: SerializedWorldMap): boolean {
    const bush: SerializedThing = {
      x: x,
      y: y,
      width: 128,
      height: 128,
      thingType: ThingTypes.STATIC,
      picture: {
        image:
          WorldMap.getRandomInteger(0, 1) == 1
            ? ImageEnum.BUSH1
            : ImageEnum.BUSH2,
      },
      rotation: WorldMap.getRandomInteger(0, 3) * 90,
    };
    if (WorldMap.checkCollision(bush, map)) {
      map.staticBackground.push(bush);
      return true;
    }
    return false;
  }
  static generateTree(x: number, y: number, map: SerializedWorldMap): boolean {
    const tree: SerializedThing = {
      x: x,
      y: y,
      width: 512,
      height: 512,
      thingType: ThingTypes.STATIC,
      picture: { image: ImageEnum.TREE },
      rotation: WorldMap.getRandomInteger(0, 3) * 90,
    };
    if (WorldMap.checkCollision(tree, map)) {
      map.staticForeground.push(tree);
      return true;
    }
    return false;
  }
  static generateRock(x: number, y: number, map: SerializedWorldMap): boolean {
    const rock: SerializedThing = {
      x: x,
      y: y,
      width: 64,
      height: 64,
      thingType: ThingTypes.STATIC,
      picture: { image: ImageEnum.ROCK },
      rotation: WorldMap.getRandomInteger(0, 3) * 90,
    };
    if (WorldMap.checkCollision(rock, map)) {
      map.staticBackground.push(rock);
      return true;
    }
    return false;
  }
  static generateTreasure(
    x: number,
    y: number,
    map: SerializedWorldMap,
    coins?: boolean
  ) {
    if (coins !== false) {
      WorldMap.generateCoins(x, y, WorldMap.getRandomInteger(10, 50), 256, map);
    }
    const rock: SerializedThing = {
      x: x,
      y: y,
      width: 256,
      height: 128,
      thingType: ThingTypes.TREASURE,
      picture: { image: ImageEnum.TREASURE },
      rotation: WorldMap.getRandomInteger(0, 1) * 180,
    };
    map.dynamicBackground.push(rock);
    return true;
  }
  static generateSkull(
    x: number,
    y: number,
    rotation: number,
    scale: number,
    map: SerializedWorldMap
  ): boolean {
    console.log(rotation);
    const skull: SerializedThing = {
      x: x,
      y: y,
      width: 256 * scale,
      height: 256 * scale,
      thingType: ThingTypes.STATIC,
      picture: { image: ImageEnum.SKULL },
      rotation: rotation,
    };
    map.dynamicBackground.splice(0, 0, skull);
    return true;
  }
  static generateGrass(
    x: number,
    y: number,
    r: number,
    map: SerializedWorldMap
  ): boolean {
    const grass: SerializedGrassPatch = {
      x: x,
      y: y,
      width: 2 * r,
      height: 2 * r,
    };
    if (WorldMap.checkCollision(grass, map)) {
      map.grass.push(grass);
      return true;
    }
    return false;
  }
  static checkCollision(
    thing: SerializedThing | Obj,
    map: SerializedWorldMap
  ): boolean {
    map.staticBackground.forEach((obj) => {
      if (Thing.collide(thing, obj)) {
        return false;
      }
    });
    map.dynamicBackground.forEach((obj) => {
      if (Thing.collide(thing, obj)) {
        return false;
      }
    });
    map.staticForeground.forEach((obj) => {
      if (Thing.collide(thing, obj)) {
        return false;
      }
    });
    map.dynamicForeground.forEach((obj) => {
      if (Thing.collide(thing, obj)) {
        return false;
      }
    });
    map.staticChanging.forEach((obj) => {
      if (Thing.collide(thing, obj)) {
        return false;
      }
    });
    return true;
  }

  static generateTestMap(size: number): SerializedWorldMap {
    const map: SerializedWorldMap = {
      grass: [],
      staticBackground: [],
      staticChanging: [],
      staticForeground: [],
      dynamicBackground: [],
      dynamicForeground: [],
      size: size,
    };
    WorldMap.generateGrass(100, 100, 100, map);
    WorldMap.generateBush(600, 100, map);
    WorldMap.generateBush(1100, 100, map);
    WorldMap.generateRock(1600, 100, map);
    WorldMap.generateTreasure(2100, 100, map);
    WorldMap.generateTree(2600, 100, map);
    WorldMap.generateHut(3100, 100, map);
    WorldMap.generateCoins(3600, 100, 100, 200, map);
    return map;
  }
  static getRandomInteger(a: number, b: number) {
    //Get a random integer in the range [a, b]
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }
  static getHutRange(i: number): [number, number] {
    if (i == 0) {
      return [0.2, 0.45];
    }
    if (i == 1) {
      return [0.45, 0.55];
    }
    if (i == 2) {
      return [0.55, 0.8];
    }

    return [0, 0];
  }
}
