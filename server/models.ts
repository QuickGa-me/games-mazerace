import {GameState, PlayerState} from '@quickga.me/framework.server';

export interface MazeRaceGameState extends GameState {
  players: MazeRacePlayerState[];
  foo: 12;
}

export interface MazeRacePlayerState extends PlayerState {
  bar: 13;
}
