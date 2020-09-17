import {MazeRaceMessage, MazeRaceSerializedGameState, MazeRaceSerializedPlayerState} from '@common/models';
import {QGClient} from 'quickgame-framework-client';

export default class MazeRaceClient extends QGClient {
  constructor() {
    super();
  }
  initializeUI(ui: {canvas: HTMLCanvasElement; context: CanvasRenderingContext2D; parent: HTMLDivElement}): void {}

  initializeAssets(): Promise<void> {
    return Promise.resolve();
  }

  initializeState(state: MazeRaceSerializedGameState): void {
    state.foo = 12;
    state.players = [];
  }

  logicTick(): void {}

  draw(msSinceLastDraw: number): void {}

  receiveMessages(message: MazeRaceMessage): void {}

  onPlayerJoin(player: MazeRaceSerializedPlayerState): void {}

  onPlayerLeave(player: MazeRaceSerializedPlayerState): void {}

  receiveState(state: MazeRaceSerializedGameState): void {}
}
