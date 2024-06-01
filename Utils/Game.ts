import { Socket } from "socket.io-client";
import WorldMap from "./WorldMap";
import { OtherPlayer, OwnPlayer } from "./playerclasses";
import { SerializedGame } from "./serialtypes";
import { ClientToServerEvents, ServerToClientEvents } from "./eventtypes";
import { SAND_COLOR, MAP_COLOR, LINE_COLOR, MAP_GRID_WIDTH } from "./constants";
import { Keys } from "./othertypes";

export class Game {
  id: string;
  players: OtherPlayer[];
  map: WorldMap;
  constructor(game: SerializedGame) {
    this.id = game.id;
    this.players = game.players.map((p) => {
      return new OtherPlayer(p);
    });
    this.map = new WorldMap(game.map);
  }

  static generateGame(id: string): SerializedGame {
    return { map: WorldMap.generateTestMap(20000), id: id, players: [] };
  }
  render(
    player: OwnPlayer,
    context: CanvasRenderingContext2D,
    keys: Keys,
    spacebarCallback: () => void,
    socket: Socket<ServerToClientEvents, ClientToServerEvents>
  ) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    const scale = 1 / player.size;
    context.save();
    context.translate(
      -player.x * scale + context.canvas.width / 2,
      -player.y * scale + context.canvas.height / 2
    );
    context.save();
    context.translate(-256 * scale, -256 * scale);
    //Draw sand
    context.fillStyle = SAND_COLOR;
    context.fillRect(
      0,
      0,
      (512 + this.map.size) * scale,
      (512 + this.map.size) * scale
    );
    context.restore();
    //Draw grassland
    context.fillStyle = MAP_COLOR;
    context.fillRect(0, 0, this.map.size * scale, this.map.size * scale);
    context.restore();
    this.map.grass.forEach((gr) => {
      gr.update(player, context);
    });
    //Draw grid
    context.save();
    context.translate(
      -player.x * scale + context.canvas.width / 2,
      -player.y * scale + context.canvas.height / 2
    );
    context.lineWidth = MAP_GRID_WIDTH * scale;
    context.strokeStyle = LINE_COLOR;
    for (let i = 0; i < this.map.size / 100; i++) {
      for (let j = 0; j < this.map.size / 100; j++) {
        context.strokeRect(
          i * 100 * scale,
          j * 100 * scale,
          100 * scale,
          100 * scale
        );
      }
    }
    context.restore();

    this.map.staticBackground.forEach((el) => {
      el.update(player, context);
    });
    this.map.dynamicBackground.forEach((el) => {
      el.update(player, context);
    });
    this.map.staticChanging
      .filter((el) => !el.onForeground)
      .forEach((el) => {
        el.update(player, context);
      });
    this.players.forEach((p) => {
      p.update(player, context);
    });
    player.update(context, keys, spacebarCallback, socket, this.map);
    this.map.staticChanging
      .filter((el) => el.onForeground)
      .forEach((el) => {
        el.update(player, context);
      });
    this.map.staticForeground.forEach((el) => {
      el.update(player, context);
    });
    this.map.dynamicForeground.forEach((el) => {
      el.update(player, context);
    });
    //TODO: Draw storm
    //temp
    context.save();
    context.fillStyle = "black";
    context.font = `30px Arial`;

    context.fillText(`x: ${player.x}`, 10, 30);
    context.fillText(`y: ${player.y}`, 10, 70);
    context.restore();
  }
}
