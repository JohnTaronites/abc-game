import type { LetterData, Point, QuestionData } from '../types';

const PALETTE = ['#FF6B6B', '#FF9F43', '#FECA57', '#26de81', '#45aaf2', '#a55eea', '#fd9644'];
const color = (index: number) => PALETTE[index % PALETTE.length];

type DigitStrokes = Point[][];

// Friendly, handwritten-style digit paths in normalized canvas coordinates.
const DIGITS: Record<string, DigitStrokes> = {
  '0': [[{ x: .5, y: .06 }, { x: .7, y: .1 }, { x: .85, y: .28 }, { x: .9, y: .5 }, { x: .85, y: .72 }, { x: .7, y: .9 }, { x: .5, y: .94 }, { x: .3, y: .9 }, { x: .15, y: .72 }, { x: .1, y: .5 }, { x: .15, y: .28 }, { x: .3, y: .1 }, { x: .5, y: .06 }]],
  '1': [[{ x: .32, y: .24 }, { x: .5, y: .08 }, { x: .5, y: .92 }], [{ x: .28, y: .92 }, { x: .72, y: .92 }]],
  '2': [[{ x: .18, y: .25 }, { x: .3, y: .08 }, { x: .58, y: .06 }, { x: .8, y: .2 }, { x: .78, y: .4 }, { x: .6, y: .58 }, { x: .18, y: .92 }, { x: .84, y: .92 }]],
  '3': [[{ x: .2, y: .14 }, { x: .42, y: .06 }, { x: .7, y: .12 }, { x: .8, y: .3 }, { x: .7, y: .48 }, { x: .48, y: .5 }, { x: .72, y: .56 }, { x: .82, y: .74 }, { x: .7, y: .92 }, { x: .42, y: .94 }, { x: .2, y: .84 }]],
  '4': [[{ x: .72, y: .92 }, { x: .72, y: .08 }], [{ x: .72, y: .08 }, { x: .14, y: .62 }, { x: .88, y: .62 }]],
  '5': [[{ x: .78, y: .08 }, { x: .28, y: .08 }, { x: .22, y: .45 }, { x: .55, y: .42 }, { x: .78, y: .56 }, { x: .78, y: .78 }, { x: .62, y: .94 }, { x: .34, y: .92 }, { x: .16, y: .78 }]],
  '6': [[{ x: .76, y: .16 }, { x: .58, y: .06 }, { x: .32, y: .16 }, { x: .16, y: .45 }, { x: .2, y: .76 }, { x: .38, y: .94 }, { x: .64, y: .92 }, { x: .8, y: .72 }, { x: .72, y: .5 }, { x: .5, y: .44 }, { x: .24, y: .56 }]],
  '7': [[{ x: .14, y: .1 }, { x: .88, y: .1 }, { x: .45, y: .92 }]],
  '8': [[{ x: .5, y: .5 }, { x: .3, y: .42 }, { x: .2, y: .24 }, { x: .3, y: .08 }, { x: .5, y: .05 }, { x: .7, y: .08 }, { x: .8, y: .24 }, { x: .7, y: .42 }, { x: .5, y: .5 }, { x: .28, y: .58 }, { x: .2, y: .76 }, { x: .3, y: .92 }, { x: .5, y: .95 }, { x: .7, y: .92 }, { x: .8, y: .76 }, { x: .72, y: .58 }, { x: .5, y: .5 }]],
  '9': [[{ x: .72, y: .44 }, { x: .46, y: .56 }, { x: .24, y: .44 }, { x: .18, y: .22 }, { x: .34, y: .06 }, { x: .62, y: .08 }, { x: .8, y: .28 }, { x: .74, y: .6 }, { x: .56, y: .92 }, { x: .28, y: .94 }]],
};

const wordFor = (value: number): string =>
  ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen',
    'Nineteen', 'Twenty'][value];

const icons = ['🐶', '🐱', '🐰', '🦊', '🐼', '🦁', '🐸'];

function numberStrokes(value: number): DigitStrokes {
  const digits = String(value).split('');
  if (digits.length === 1) return DIGITS[digits[0]];

  return digits.flatMap((digit, index) =>
    DIGITS[digit].map(stroke => stroke.map(point => ({
      x: .07 + index * .47 + point.x * .38,
      y: point.y,
    }))),
  );
}

export const NUMBERS: LetterData[] = Array.from({ length: 21 }, (_, value) => ({
  letter: String(value),
  strokes: numberStrokes(value),
  color: color(value),
  emoji: icons[value % icons.length],
  word: wordFor(value),
}));

function answerValues(value: number): number[] {
  const candidates = [value, value - 1, value + 1, value - 2, value + 2, value - 3, value + 3]
    .filter(candidate => candidate >= 0 && candidate <= 20);
  return [...new Set(candidates)].slice(0, 3);
}

export const NUMBER_QUESTIONS: QuestionData[] = Array.from({ length: 21 }, (_, value) => ({
  letter: String(value),
  question: 'How many animals do you see?',
  itemsToCount: Array.from({ length: value }, (_, index) => icons[index % icons.length]),
  audioKey: String(value),
  options: answerValues(value).map(option => ({
    text: String(option),
    emoji: '🔢',
    isCorrect: option === value,
  })),
}));
