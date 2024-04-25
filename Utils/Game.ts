import { Socket } from "socket.io-client";
import WorldMap from "./WorldMap";
import { OtherPlayer, OwnPlayer } from "./playerclasses";
import { SerializedGame } from "./serialtypes";
import { ClientToServerEvents, ServerToClientEvent } from "./eventtypes";

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
    return { map: WorldMap.generateMap(20000), id: id, players: [] };
  }
  render(
    player: OwnPlayer,
    context: CanvasRenderingContext2D,
    keys: {
      w: boolean;
      d: boolean;
      s: boolean;
      a: boolean;
      spacebartime: number;
      spacebarhold: number;
    },
    spacebarCallback: () => void,
    socket: Socket<ServerToClientEvent, ClientToServerEvents>
  ) {
    //Draw sand

    //Draw grassland

    this.map.grass.forEach((gr) => {
      gr.update(player, context);
    });
    //Draw grid

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
    player.update(context, keys, spacebarCallback, socket);
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
    //Draw storm
  }
}
