import {Message, SerializedGameState, SerializedPlayerState} from '@quickga.me/framework.common';

export interface MazeRaceSerializedGameState extends SerializedGameState {
  players: MazeRaceSerializedPlayerState[];
  foo: 12;
}

export interface MazeRaceSerializedPlayerState extends SerializedPlayerState {
  bar: 13;
}

export type MazeRaceMessage = Message & {
  type: 'player-joined';
};
