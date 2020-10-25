import {MazeRaceGameState, MazeRacePlayerState} from './models';
import {MazeRaceMessage, MazeRaceSerializedGameState} from '@common/models';
import {QGServer, ServerConfig} from '@quickga.me/framework.server';
import {MazeGeneration, MazeGenerator} from '@common/mazeGenerator';
import {MathUtils} from '@quickga.me/framework.common';

export default class MazeRaceServer extends QGServer<MazeRaceMessage> {
  private maze: MazeGeneration;
  private berries: {x: number; y: number}[] = [];
  constructor(config: ServerConfig) {
    super(config);
    this.maze = MazeGenerator(30, 30);
  }
  onStart() {
    this.sendMessageToEveryone({type: 'maze', maze: this.maze});
  }

  ticks = 0;
  onTick(msSinceLastTick: number): void {
    if (this.ticks++ % 240 === 0) {
      this.berries.length = 0;
      for (let i = 0; i < 100; i++) {
        this.berries.push({
          x: Math.round(Math.random() * 30 * 10 * 10),
          y: Math.round(Math.random() * 30 * 10 * 10),
        });
      }
      this.sendMessageToEveryone({type: 'berries', berries: this.berries});
    }
  }

  receiveMessage(connectionId: number, message: MazeRaceMessage): void {
    switch (message.type) {
      case 'move':
        const player = this.players.find((p) => p.connectionId === connectionId);
        if (!player) {
          return;
        }
        player.x = message.x;
        player.y = message.y;

        for (const berry of this.berries) {
          if (MathUtils.distance(player.x, player.y, berry.x, berry.y) < 15) {
            this.berries.splice(this.berries.indexOf(berry), 1);
            this.sendMessageToEveryone({type: 'berries', berries: this.berries});
            break;
          }
        }
        break;
    }
  }

  players: {connectionId: number; x: number; y: number; playerId: string}[] = [];
  onPlayerJoin(connectionId: number): MazeRacePlayerState {
    console.log('JOIN  ', connectionId);
    this.players.push({
      connectionId,
      x: 30,
      y: 30,
      playerId: this.players.length + '',
    });
    this.sendMessageToPlayer(this.players[this.players.length - 1], {
      type: 'join',
      playerId: this.players[this.players.length - 1].playerId,
    });
    return this.players[this.players.length - 1] as any;
  }

  onPlayerLeave(connectionId: number): MazeRaceGameState {
    console.log('LEAVE', connectionId);
    this.players = this.players.filter((p) => p.connectionId === connectionId);
    return undefined!;
  }

  serializeState(): MazeRaceSerializedGameState {
    return {
      players: this.players.map((p) => ({
        id: p.playerId,
        x: p.x,
        y: p.y,
      })),
    };
  }
}
