import {MazeRaceMessage, MazeRaceSerializedGameState, MazeRaceSerializedPlayerState} from '@common/models';
// import {ClientEngineUI} from '@quickga.me/framework.client';
import {QGClient} from '@quickga.me/framework.client';
import React from 'react';
import {MazeGame} from './mazeRace';
import {MazeGenerator} from '@common/mazeGenerator';

type PlayerInputKeys = {down: boolean; left: boolean; right: boolean; up: boolean; shoot: boolean};

export default class MazeRaceClient implements QGClient /*extends ClientEngineUI*/ {
  constructor() {
    // super();
  }

  initializeAssets(): Promise<void> {
    return Promise.resolve();
  }

  initializeState(state: MazeRaceSerializedGameState): void {
    state.players = [];
  }

  logicTick(): void {}

  ready = false;
  draw(msSinceLastDraw: number): void {
    if (!this.canvas.current) return;
    /*
    const canvas = this.canvas.current;
    const context = canvas.getContext('2d')!;
    context.clearRect(0, 0, 100, 100);
    context.fillRect(this.x % 120, this.y % 120, 20, 20);
    this.x += Math.random();
    this.y += Math.random();
*/
  }
  private mazeGame?: MazeGame;

  x: number = 0;
  y: number = 0;

  receiveMessages(message: MazeRaceMessage): void {
    switch (message.type) {
      case 'maze':
        this.mazeGame?.startGame(message.maze);
        break;
      case 'join':
        this.mazeGame = new MazeGame();
        this.mazeGame.mazeClient.onUpdate = (state) => {
          this.sendMessage({
            type: 'move',
            x: state.x,
            y: state.y,
          });
        };
        this.mazeGame.mazeClient.currentPlayerID = message.playerId;
        break;
    }
  }

  onPlayerJoin(player: MazeRaceSerializedPlayerState): void {}

  onPlayerLeave(player: MazeRaceSerializedPlayerState): void {}

  receiveState(state: MazeRaceSerializedGameState): void {
    if (!this.mazeGame || !this.mazeGame.mazeClient) return;
    for (const player of state.players ?? []) {
      const foundPlayer = this.mazeGame.mazeClient.players.find((p) => p.userId === player.id);
      if (!foundPlayer) {
        this.mazeGame.mazeClient.players.push({
          moveToX: player.x,
          moveToY: player.y,
          position: {
            x: player.x,
            y: player.y,
          },
          userId: player.id,
        });
      } else {
        foundPlayer.moveToX = player.x;
        foundPlayer.moveToY = player.y;
      }
    }
  }

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

  get receivedMessages(): [] {
    return [];
  }

  sendMessage(message: MazeRaceMessage): void {
    (this as any).$send(message);
  }
}
