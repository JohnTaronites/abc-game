// Core point type used across the game
export interface Point {
  x: number;
  y: number;
}

// A single stroke is an ordered array of normalized points (0–1 range)
export type Stroke = Point[];

// Checkpoint for accuracy validation
export interface Checkpoint {
  x: number; // 0-1 normalized
  y: number; // 0-1 normalized
  radius: number; // tolerance in 0-1 units
}

// Full definition of a letter
export interface LetterData {
  letter: string;
  strokes: Stroke[]; // normalized 0-1, each array is one continuous pen stroke
  color: string;
  emoji: string;
  word: string; // example word (e.g. "Apple")
}

// A single answer option in the mini-game
export interface AnswerOption {
  text: string;
  emoji: string;
  isCorrect: boolean;
}

// Mini-game question
export interface QuestionData {
  letter: string;
  question: string;
  options: AnswerOption[];
  /** Optional row of items to count in a number question. */
  itemsToCount?: string[];
  /** Audio file key (without extension) used by number questions. */
  audioKey?: string;
}

// Game phase
export type GamePhase = 'mode-select' | 'menu' | 'tracing' | 'result' | 'minigame';

export type GameMode = 'abc' | 'numbers';

// Progress stored per letter (stars 0-3)
export type LetterProgress = Record<string, number>;

// Full app state
export interface AppState {
  phase: GamePhase;
  mode: GameMode | null;
  currentLetterIndex: number;
  accuracy: number;
  attempts: number;
  miniGameCorrect: boolean | null;
  letterProgress: LetterProgress;
  totalScore: number;
}
