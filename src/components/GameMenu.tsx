import React from 'react';
import type { LetterData, LetterProgress } from '../types';

interface GameMenuProps {
  letters: LetterData[];
  letterProgress: LetterProgress;
  onSelectLetter: (index: number) => void;
  onBack: () => void;
  title?: string;
  subtitle?: string;
  itemName?: string;
}

const GameMenu: React.FC<GameMenuProps> = ({
  letters, letterProgress, onSelectLetter, onBack,
  title = '🔤 ABC Tracing', subtitle = 'Learn to write all the letters!', itemName = 'letters',
}) => {
  const completedCount = Object.keys(letterProgress).length;
  const totalScore = Object.values(letterProgress).reduce((sum, s) => sum + s, 0);

  return (
    <div className="game-menu">
      <div className="menu-header">
        <button className="menu-back" onClick={onBack} aria-label="Choose another game">←</button>
        <h1 className="menu-title">{title}</h1>
        <p className="menu-subtitle">{subtitle}</p>
        <div className="menu-stats">
          <span>📚 {completedCount}/{letters.length} {itemName}</span>
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

      {completedCount === letters.length && (
        <div className="menu-celebrate">
          🎉 You finished all {letters.length} {itemName}! Amazing!
        </div>
      )}
    </div>
  );
};

export default GameMenu;
