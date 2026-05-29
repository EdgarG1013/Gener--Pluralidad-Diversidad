export type CellType = 'normal' | 'question' | 'teacher-action' | 'barrier' | 'reward' | 'skip-turn';

export interface Cell {
  id: number;
  type: CellType;
  label: string;
  effect?: number;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  position: number;
  stars: number;
  color: string;
  skipNextTurn?: boolean;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export type GameScreen =
  | 'home'
  | 'how-to-play'
  | 'player-join'   // elegir nombre/avatar antes de crear o unirse
  | 'lobby'         // sala de espera (pre-partida)
  | 'game-board'
  | 'question'
  | 'victory'
  | 'spectator';

export interface GameState {
  screen: GameScreen;
  players: Player[];
  currentPlayerIndex: number;
  board: Cell[];
  currentQuestion: Question | null;
  winner: Player | null;
  diceValue: number | null;
  isRollingDice: boolean;
  isMoving: boolean;
  sessionCode: string | null;
  sessionStatus: 'lobby' | 'playing' | 'finished';
  hostPlayerId: string | null;
  isSpectator: boolean; // solo local, no se sincroniza
}
