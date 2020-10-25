import {MazeRaceGameState, MazeRacePlayerState} from './models';
import {MazeRaceMessage, MazeRaceSerializedGameState} from '@common/models';
import {QGServer, ServerConfig} from '@quickga.me/framework.server';
import {MazeGenerator} from '@common/mazeGenerator';

export default class MazeRaceServer extends QGServer<MazeRaceMessage> {
  constructor(config: ServerConfig) {
    super(config);
  }
  onStart() {
    const maze = MazeGenerator(30, 30);
    this.sendMessageToEveryone({type: 'maze', maze});
  }

  onTick(msSinceLastTick: number): void {}

  receiveMessage(connectionId: number, message: MazeRaceMessage): void {
    switch (message.type) {
      case 'move':
        const player = this.players.find((p) => p.connectionId === connectionId);
        if (!player) {
          return;
        }
        player.x = message.x;
        player.y = message.y;
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
