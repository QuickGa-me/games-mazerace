import {MazeRaceMessage, MazeRaceSerializedGameState, MazeRaceSerializedPlayerState} from '@common/models';
import {QGClient} from '@quickga.me/framework.client';
import React from 'react';
import {MazeGame} from './mazeRace';

export default class MazeRaceClient extends QGClient {
  constructor() {
    super();
  }

  initializeAssets(): Promise<void> {
    return Promise.resolve();
  }

  initializeState(state: MazeRaceSerializedGameState): void {
    state.foo = 12;
    state.players = [];
  }

  logicTick(): void {}

  ready = false;
  draw(msSinceLastDraw: number): void {
    if (!this.canvas.current) return;
    if (!this.ready) {
      this.ready = true;
      new MazeGame();
    }
    /*
    const canvas = this.canvas.current;
    const context = canvas.getContext('2d')!;
    context.clearRect(0, 0, 100, 100);
    context.fillRect(this.x % 120, this.y % 120, 20, 20);
    this.x += Math.random();
    this.y += Math.random();
*/
  }

  x: number = 0;
  y: number = 0;

  receiveMessages(message: MazeRaceMessage): void {}

  onPlayerJoin(player: MazeRaceSerializedPlayerState): void {}

  onPlayerLeave(player: MazeRaceSerializedPlayerState): void {}

  receiveState(state: MazeRaceSerializedGameState): void {}

  canvas: {current: HTMLCanvasElement | null} = {current: null};

  render() {
    return (
      <>
        <canvas
          id={'mazecanvas'}
          ref={this.canvas}
          width={100}
          height={100}
          style={{width: '100%', height: '100%', position: 'absolute'}}
        />
        <canvas
          id={'solutionCanvas'}
          width={100}
          height={100}
          style={{width: '100%', height: '100%', position: 'absolute'}}
        />
        <canvas
          id={'visibilityCanvas'}
          width={100}
          height={100}
          style={{width: '100%', height: '100%', position: 'absolute'}}
        />
        <canvas
          id={'playersCanvas'}
          width={100}
          height={100}
          style={{width: '100%', height: '100%', position: 'absolute'}}
        />
      </>
    );
  }
}
