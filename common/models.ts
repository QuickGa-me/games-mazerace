import {Message, SerializedGameState, SerializedPlayerState} from '@quickga.me/framework.common';
import {MazeGeneration} from './mazeGenerator';

export interface MazeRaceSerializedGameState {
  players: MazeRaceSerializedPlayerState[];
}

export interface MazeRaceSerializedPlayerState {
  x: number;
  y: number;
  id: string;
}

export type MazeRaceMessage = Message &
  (
    | {
        type: 'move';
        x: number;
        y: number;
      }
    | {
        type: 'maze';
        maze: MazeGeneration;
      }
    | {
        type: 'join';
        playerId: string;
      }
  );
