import React from 'react';
import type { LetterData } from '../types';

interface ProgressBarProps {
  letters: LetterData[];
  currentIndex: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ letters, currentIndex }) => {
  const pct = Math.round(((currentIndex) / letters.length) * 100);

  return (
    <div className="progress-bar-wrapper">
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="progress-label">
        {currentIndex + 1} / {letters.length}
      </span>
    </div>
  );
};

export default ProgressBar;
