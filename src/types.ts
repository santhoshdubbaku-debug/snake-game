export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
  duration: number; // in seconds
}

export interface GameState {
  score: number;
  highScore: number;
  isGameOver: boolean;
  isPaused: boolean;
}

export type Direction = { x: number; y: number };
