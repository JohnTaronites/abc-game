/**
 * Simple audio player — stops any previous sound before playing a new one.
 * Uses import.meta.env.BASE_URL so paths work both locally ("/") and on
 * GitHub Pages ("/abc-game/").
 */

// Map word display text → filename (handles spaces, special cases)
const WORD_FILE: Record<string, string> = {
  'Apple':     'apple',
  'Bear':      'bear',
  'Car':       'car',
  'Dragon':    'dragon',
  'Elephant':  'elephant',
  'Fish':      'fish',
  'Grape':     'grape',
  'Hat':       'hat',
  'Ice Cream': 'ice-cream',
  'Juice':     'juice',
  'Kite':      'kite',
  'Lion':      'lion',
  'Moon':      'moon',
  'Nest':      'nest',
  'Orange':    'orange',
  'Pig':       'pig',
  'Queen':     'queen',
  'Rabbit':    'rabbit',
  'Star':      'star',
  'Tiger':     'tiger',
  'Umbrella':  'umbrella',
  'Van':       'van',
  'Whale':     'whale',
  'Xylophone': 'xylophone',
  'Yak':       'yak',
  'Zebra':     'zebra',
};

let current: HTMLAudioElement | null = null;

function play(path: string): void {
  // Stop & discard the previous clip
  if (current) {
    current.pause();
    current.src = '';
    current = null;
  }
  // BASE_URL ends with '/', so we don't add an extra slash
  const base = import.meta.env.BASE_URL ?? '/';
  const audio = new Audio(`${base}${path}`);
  current = audio;
  audio.play().catch(() => {
    // Autoplay policy may block — silently ignore
  });
}

/** Play the word clip, e.g. playWord('Ice Cream') → /audio/words/ice-cream.mp3 */
export function playWord(word: string): void {
  const file = WORD_FILE[word];
  if (file) play(`audio/words/${file}.mp3`);
}

export type FeedbackSound = 'correct' | 'wrong' | 'great_job' | 'try_again';

/** Play a feedback clip, e.g. playFeedback('great_job') */
export function playFeedback(type: FeedbackSound): void {
  play(`audio/feedback/${type}.mp3`);
}
