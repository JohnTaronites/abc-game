import React from 'react';
import type { LetterData, LetterProgress } from '../types';

interface GameMenuProps {
  letters: LetterData[];
  letterProgress: LetterProgress;
  onSelectLetter: (index: number) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ letters, letterProgress, onSelectLetter }) => {
  const completedCount = Object.keys(letterProgress).length;
  const totalScore = Object.values(letterProgress).reduce((sum, s) => sum + s, 0);

  return (
    <div className="game-menu">
      <div className="menu-header">
        <h1 className="menu-title">🔤 ABC Tracing</h1>
        <p className="menu-subtitle">Learn to write all the letters!</p>
        <div className="menu-stats">
          <span>📚 {completedCount}/26 letters</span>
          <span>⭐ {totalScore} stars</span>
        </div>
      </div>

      <div className="letter-grid">
        {letters.map((letter, index) => {
          const stars = letterProgress[letter.letter] ?? -1;
          const done = stars >= 0;

          return (
            <button
              key={letter.letter}
              className={`letter-tile ${done ? 'done' : ''}`}
              style={{ '--letter-color': letter.color } as React.CSSProperties}
              onClick={() => onSelectLetter(index)}
            >
              <span className="tile-letter">{letter.letter}</span>
              <span className="tile-emoji">{letter.emoji}</span>
              {done && (
                <span className="tile-stars">
                  {'⭐'.repeat(stars)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {completedCount === 26 && (
        <div className="menu-celebrate">
          🎉 You finished all 26 letters! Amazing!
        </div>
      )}
    </div>
  );
};

export default GameMenu;
