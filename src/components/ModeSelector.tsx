import React from 'react';
import type { GameMode } from '../types';

interface ModeSelectorProps {
  onSelect: (mode: GameMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelect }) => (
  <main className="mode-selector">
    <div className="mode-selector-intro">
      <span className="mode-selector-emoji">✏️</span>
      <h1>Tracing Time!</h1>
      <p>What would you like to practise today?</p>
    </div>

    <div className="mode-cards">
      <button className="mode-card mode-card-abc" onClick={() => onSelect('abc')}>
        <span className="mode-card-symbol">ABC</span>
        <span className="mode-card-title">Letters</span>
        <span className="mode-card-copy">Trace A to Z</span>
      </button>
      <button className="mode-card mode-card-numbers" onClick={() => onSelect('numbers')}>
        <span className="mode-card-symbol">123</span>
        <span className="mode-card-title">Numbers</span>
        <span className="mode-card-copy">Trace 0 to 20</span>
      </button>
    </div>
  </main>
);

export default ModeSelector;
