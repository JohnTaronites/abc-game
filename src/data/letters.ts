import type { LetterData } from '../types';

// Color palette — cycles through bright kid-friendly colors
const P = ['#FF6B6B', '#FF9F43', '#FECA57', '#26de81', '#45aaf2', '#a55eea', '#fd9644'];
const c = (i: number) => P[i % P.length];

/**
 * Stroke paths are defined in normalized [0, 1] x [0, 1] space.
 * (0,0) = top-left, (1,1) = bottom-right.
 * Each stroke is an array of [x, y] waypoints drawn with lineTo / quadraticCurveTo.
 * Curved letters use many intermediate points to approximate smooth curves.
 */
export const LETTERS: LetterData[] = [
  {
    letter: 'A', color: c(0), emoji: '🍎', word: 'Apple',
    strokes: [
      [{ x: 0.5, y: 0.08 }, { x: 0.12, y: 0.92 }],
      [{ x: 0.5, y: 0.08 }, { x: 0.88, y: 0.92 }],
      [{ x: 0.22, y: 0.58 }, { x: 0.78, y: 0.58 }],
    ],
  },
  {
    letter: 'B', color: c(1), emoji: '🐻', word: 'Bear',
    strokes: [
      [{ x: 0.22, y: 0.08 }, { x: 0.22, y: 0.92 }],
      [
        { x: 0.22, y: 0.08 }, { x: 0.6, y: 0.08 }, { x: 0.72, y: 0.16 },
        { x: 0.72, y: 0.3 }, { x: 0.72, y: 0.44 }, { x: 0.6, y: 0.5 }, { x: 0.22, y: 0.5 },
        { x: 0.65, y: 0.5 }, { x: 0.78, y: 0.6 }, { x: 0.78, y: 0.74 },
        { x: 0.78, y: 0.88 }, { x: 0.65, y: 0.92 }, { x: 0.22, y: 0.92 },
      ],
    ],
  },
  {
    letter: 'C', color: c(2), emoji: '🐱', word: 'Cat',
    strokes: [
      [
        { x: 0.82, y: 0.28 }, { x: 0.72, y: 0.12 }, { x: 0.55, y: 0.05 },
        { x: 0.38, y: 0.07 }, { x: 0.22, y: 0.18 }, { x: 0.12, y: 0.35 },
        { x: 0.1, y: 0.5 }, { x: 0.12, y: 0.65 }, { x: 0.22, y: 0.82 },
        { x: 0.38, y: 0.93 }, { x: 0.55, y: 0.95 }, { x: 0.72, y: 0.88 }, { x: 0.82, y: 0.72 },
      ],
    ],
  },
  {
    letter: 'D', color: c(3), emoji: '🐉', word: 'Dragon',
    strokes: [
      [{ x: 0.22, y: 0.08 }, { x: 0.22, y: 0.92 }],
      [
        { x: 0.22, y: 0.08 }, { x: 0.52, y: 0.08 }, { x: 0.75, y: 0.2 },
        { x: 0.82, y: 0.38 }, { x: 0.82, y: 0.5 }, { x: 0.82, y: 0.62 },
        { x: 0.75, y: 0.8 }, { x: 0.52, y: 0.92 }, { x: 0.22, y: 0.92 },
      ],
    ],
  },
  {
    letter: 'E', color: c(4), emoji: '🐘', word: 'Elephant',
    strokes: [
      [{ x: 0.22, y: 0.08 }, { x: 0.22, y: 0.92 }],
      [{ x: 0.22, y: 0.08 }, { x: 0.78, y: 0.08 }],
      [{ x: 0.22, y: 0.5 }, { x: 0.65, y: 0.5 }],
      [{ x: 0.22, y: 0.92 }, { x: 0.78, y: 0.92 }],
    ],
  },
  {
    letter: 'F', color: c(5), emoji: '🐟', word: 'Fish',
    strokes: [
      [{ x: 0.22, y: 0.08 }, { x: 0.22, y: 0.92 }],
      [{ x: 0.22, y: 0.08 }, { x: 0.78, y: 0.08 }],
      [{ x: 0.22, y: 0.5 }, { x: 0.65, y: 0.5 }],
    ],
  },
  {
    letter: 'G', color: c(6), emoji: '🍇', word: 'Grape',
    strokes: [
      [
        { x: 0.82, y: 0.28 }, { x: 0.72, y: 0.12 }, { x: 0.55, y: 0.05 },
        { x: 0.38, y: 0.07 }, { x: 0.22, y: 0.18 }, { x: 0.12, y: 0.35 },
        { x: 0.1, y: 0.5 }, { x: 0.12, y: 0.65 }, { x: 0.22, y: 0.82 },
        { x: 0.38, y: 0.93 }, { x: 0.55, y: 0.95 }, { x: 0.72, y: 0.88 },
        { x: 0.82, y: 0.72 }, { x: 0.82, y: 0.5 }, { x: 0.52, y: 0.5 },
      ],
    ],
  },
  {
    letter: 'H', color: c(0), emoji: '🎩', word: 'Hat',
    strokes: [
      [{ x: 0.15, y: 0.08 }, { x: 0.15, y: 0.92 }],
      [{ x: 0.85, y: 0.08 }, { x: 0.85, y: 0.92 }],
      [{ x: 0.15, y: 0.5 }, { x: 0.85, y: 0.5 }],
    ],
  },
  {
    letter: 'I', color: c(1), emoji: '🍦', word: 'Ice Cream',
    strokes: [
      [{ x: 0.3, y: 0.08 }, { x: 0.7, y: 0.08 }],
      [{ x: 0.5, y: 0.08 }, { x: 0.5, y: 0.92 }],
      [{ x: 0.3, y: 0.92 }, { x: 0.7, y: 0.92 }],
    ],
  },
  {
    letter: 'J', color: c(2), emoji: '🧃', word: 'Juice',
    strokes: [
      [{ x: 0.35, y: 0.08 }, { x: 0.65, y: 0.08 }],
      [
        { x: 0.65, y: 0.08 }, { x: 0.65, y: 0.72 },
        { x: 0.55, y: 0.9 }, { x: 0.38, y: 0.95 }, { x: 0.22, y: 0.72 },
      ],
    ],
  },
  {
    letter: 'K', color: c(3), emoji: '🪁', word: 'Kite',
    strokes: [
      [{ x: 0.2, y: 0.08 }, { x: 0.2, y: 0.92 }],
      [{ x: 0.8, y: 0.08 }, { x: 0.2, y: 0.5 }],
      [{ x: 0.35, y: 0.42 }, { x: 0.8, y: 0.92 }],
    ],
  },
  {
    letter: 'L', color: c(4), emoji: '🦁', word: 'Lion',
    strokes: [
      [{ x: 0.22, y: 0.08 }, { x: 0.22, y: 0.92 }, { x: 0.78, y: 0.92 }],
    ],
  },
  {
    letter: 'M', color: c(5), emoji: '🌙', word: 'Moon',
    strokes: [
      [
        { x: 0.08, y: 0.92 }, { x: 0.08, y: 0.08 },
        { x: 0.5, y: 0.55 },
        { x: 0.92, y: 0.08 }, { x: 0.92, y: 0.92 },
      ],
    ],
  },
  {
    letter: 'N', color: c(6), emoji: '🪺', word: 'Nest',
    strokes: [
      [
        { x: 0.15, y: 0.92 }, { x: 0.15, y: 0.08 },
        { x: 0.85, y: 0.92 }, { x: 0.85, y: 0.08 },
      ],
    ],
  },
  {
    letter: 'O', color: c(0), emoji: '🍊', word: 'Orange',
    strokes: [
      [
        { x: 0.5, y: 0.06 }, { x: 0.7, y: 0.08 }, { x: 0.85, y: 0.2 },
        { x: 0.92, y: 0.5 }, { x: 0.85, y: 0.8 }, { x: 0.7, y: 0.92 },
        { x: 0.5, y: 0.94 }, { x: 0.3, y: 0.92 }, { x: 0.15, y: 0.8 },
        { x: 0.08, y: 0.5 }, { x: 0.15, y: 0.2 }, { x: 0.3, y: 0.08 }, { x: 0.5, y: 0.06 },
      ],
    ],
  },
  {
    letter: 'P', color: c(1), emoji: '🐷', word: 'Pig',
    strokes: [
      [{ x: 0.22, y: 0.08 }, { x: 0.22, y: 0.92 }],
      [
        { x: 0.22, y: 0.08 }, { x: 0.6, y: 0.08 }, { x: 0.72, y: 0.18 },
        { x: 0.72, y: 0.32 }, { x: 0.72, y: 0.44 }, { x: 0.6, y: 0.5 }, { x: 0.22, y: 0.5 },
      ],
    ],
  },
  {
    letter: 'Q', color: c(2), emoji: '👸', word: 'Queen',
    strokes: [
      [
        { x: 0.5, y: 0.06 }, { x: 0.7, y: 0.08 }, { x: 0.85, y: 0.2 },
        { x: 0.92, y: 0.5 }, { x: 0.85, y: 0.8 }, { x: 0.7, y: 0.92 },
        { x: 0.5, y: 0.94 }, { x: 0.3, y: 0.92 }, { x: 0.15, y: 0.8 },
        { x: 0.08, y: 0.5 }, { x: 0.15, y: 0.2 }, { x: 0.3, y: 0.08 }, { x: 0.5, y: 0.06 },
      ],
      [{ x: 0.6, y: 0.72 }, { x: 0.88, y: 0.96 }],
    ],
  },
  {
    letter: 'R', color: c(3), emoji: '🐰', word: 'Rabbit',
    strokes: [
      [{ x: 0.22, y: 0.08 }, { x: 0.22, y: 0.92 }],
      [
        { x: 0.22, y: 0.08 }, { x: 0.6, y: 0.08 }, { x: 0.72, y: 0.18 },
        { x: 0.72, y: 0.32 }, { x: 0.72, y: 0.44 }, { x: 0.6, y: 0.5 }, { x: 0.22, y: 0.5 },
      ],
      [{ x: 0.42, y: 0.5 }, { x: 0.8, y: 0.92 }],
    ],
  },
  {
    letter: 'S', color: c(4), emoji: '⭐', word: 'Star',
    strokes: [
      [
        { x: 0.75, y: 0.2 }, { x: 0.65, y: 0.08 }, { x: 0.45, y: 0.06 },
        { x: 0.25, y: 0.15 }, { x: 0.2, y: 0.32 }, { x: 0.35, y: 0.46 },
        { x: 0.5, y: 0.5 }, { x: 0.65, y: 0.54 }, { x: 0.8, y: 0.68 },
        { x: 0.78, y: 0.84 }, { x: 0.62, y: 0.94 }, { x: 0.42, y: 0.94 }, { x: 0.25, y: 0.85 },
      ],
    ],
  },
  {
    letter: 'T', color: c(5), emoji: '🐯', word: 'Tiger',
    strokes: [
      [{ x: 0.1, y: 0.08 }, { x: 0.9, y: 0.08 }],
      [{ x: 0.5, y: 0.08 }, { x: 0.5, y: 0.92 }],
    ],
  },
  {
    letter: 'U', color: c(6), emoji: '☂️', word: 'Umbrella',
    strokes: [
      [
        { x: 0.15, y: 0.08 }, { x: 0.15, y: 0.72 },
        { x: 0.22, y: 0.85 }, { x: 0.5, y: 0.95 },
        { x: 0.78, y: 0.85 }, { x: 0.85, y: 0.72 }, { x: 0.85, y: 0.08 },
      ],
    ],
  },
  {
    letter: 'V', color: c(0), emoji: '🚐', word: 'Van',
    strokes: [
      [{ x: 0.1, y: 0.08 }, { x: 0.5, y: 0.92 }, { x: 0.9, y: 0.08 }],
    ],
  },
  {
    letter: 'W', color: c(1), emoji: '🐋', word: 'Whale',
    strokes: [
      [
        { x: 0.05, y: 0.08 }, { x: 0.22, y: 0.92 },
        { x: 0.5, y: 0.52 },
        { x: 0.78, y: 0.92 }, { x: 0.95, y: 0.08 },
      ],
    ],
  },
  {
    letter: 'X', color: c(2), emoji: '🎶', word: 'Xylophone',
    strokes: [
      [{ x: 0.12, y: 0.08 }, { x: 0.88, y: 0.92 }],
      [{ x: 0.88, y: 0.08 }, { x: 0.12, y: 0.92 }],
    ],
  },
  {
    letter: 'Y', color: c(3), emoji: '🦬', word: 'Yak',
    strokes: [
      [{ x: 0.12, y: 0.08 }, { x: 0.5, y: 0.5 }],
      [{ x: 0.88, y: 0.08 }, { x: 0.5, y: 0.5 }],
      [{ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.92 }],
    ],
  },
  {
    letter: 'Z', color: c(4), emoji: '🦓', word: 'Zebra',
    strokes: [
      [
        { x: 0.1, y: 0.08 }, { x: 0.9, y: 0.08 },
        { x: 0.1, y: 0.92 }, { x: 0.9, y: 0.92 },
      ],
    ],
  },
];
