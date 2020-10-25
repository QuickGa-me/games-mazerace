import {GameState, PlayerState} from '@quickga.me/framework.server';

export interface MazeRaceGameState extends GameState {
  players: MazeRacePlayerState[];
}

export interface MazeRacePlayerState extends PlayerState {
  x: number;
  y: number;
}
