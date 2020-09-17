import {MazeRaceGameState, MazeRacePlayerState} from './models';
import {MazeRaceMessage, MazeRaceSerializedGameState} from '@common/models';
import {QGServer, ServerConfig} from 'quickgame-framework-server';
console.log('hia');

export default class MazeRaceServer extends QGServer {
  constructor(config: ServerConfig) {
    super(config);
  }
  onTick(msSinceLastTick: number): void {}

  receiveMessages(message: MazeRaceMessage): void {}

  onPlayerJoin(): MazeRacePlayerState {
    return undefined!;
  }

  onPlayerLeave(): MazeRaceGameState {
    return undefined!;
  }

  serializeState(): MazeRaceSerializedGameState {
    return undefined!;
  }
}
