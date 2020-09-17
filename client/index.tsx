import {MazeRaceMessage, MazeRaceSerializedGameState, MazeRaceSerializedPlayerState} from '@common/models';
import {QGClient} from 'quickgame-framework-client';
import React, {useEffect, useState} from 'react';

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

  draw(msSinceLastDraw: number): void {
    if (!this.canvas.current) return;
    const canvas = this.canvas.current;
    const context = canvas.getContext('2d')!;
    context.clearRect(0, 0, 100, 100);
    context.fillRect(this.x % 120, this.y % 120, 20, 20);
    this.x += Math.random();
    this.y += Math.random();
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
        <Foo></Foo>
        <canvas ref={this.canvas} width={100} height={100} style={{width: '100%', height: '100%'}}></canvas>
      </>
    );
  }
}

function Foo() {
  const [value, setValue] = useState(12);

  useEffect(() => {
    setTimeout(() => {
      setValue(Math.random);
    }, 100);
  });
  return <span>{value}</span>;
}
