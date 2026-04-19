import React, { useState, useEffect, useCallback } from 'react';
import type { AppState, LetterProgress } from './types';
import { LETTERS } from './data/letters';
import { QUESTIONS } from './data/questions';
import { accuracyToStars } from './utils/accuracy';
import GameMenu from './components/GameMenu';
import CanvasTracer from './components/CanvasTracer';
import ResultScreen from './components/ResultScreen';
import MiniGame from './components/MiniGame';
import ProgressBar from './components/ProgressBar';
import './App.css';

const STORAGE_KEY = 'abc-game-progress';
const MAX_ATTEMPTS = 3;

function loadProgress(): LetterProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const defaultState = (): AppState => ({
  phase: 'menu',
  currentLetterIndex: 0,
  accuracy: 0,
  attempts: 0,
  miniGameCorrect: null,
  letterProgress: loadProgress(),
  totalScore: 0,
});

export default function App() {
  const [state, setState] = useState<AppState>(defaultState);
  // tracerKey forces CanvasTracer to fully remount (reset strokes) on each letter
  const [tracerKey, setTracerKey] = useState(0);

  // Persist progress whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.letterProgress));
  }, [state.letterProgress]);

  const currentLetter = LETTERS[state.currentLetterIndex];
  const currentQuestion = QUESTIONS[state.currentLetterIndex];

  const goToMenu = useCallback(() =>
    setState(s => ({ ...s, phase: 'menu', attempts: 0, accuracy: 0, miniGameCorrect: null })),
    [],
  );

  const selectLetter = useCallback((index: number) => {
    setState(s => ({ ...s, phase: 'tracing', currentLetterIndex: index, attempts: 0, accuracy: 0 }));
    setTracerKey(k => k + 1);
  }, []);

  const handleCheck = useCallback((accuracy: number) => {
    setState(s => ({ ...s, phase: 'result', accuracy, attempts: s.attempts + 1 }));
  }, []);

  const handleRetry = useCallback(() => {
    setState(s => ({ ...s, phase: 'tracing' }));
    setTracerKey(k => k + 1);
  }, []);

  const handleResultContinue = useCallback(() => {
    const stars = accuracyToStars(state.accuracy);
    const letter = currentLetter.letter;
    const prevStars = state.letterProgress[letter] ?? 0;

    setState(s => ({
      ...s,
      phase: 'minigame',
      letterProgress: { ...s.letterProgress, [letter]: Math.max(prevStars, stars) },
    }));
  }, [state.accuracy, state.letterProgress, currentLetter]);

  const handleMiniGameComplete = useCallback((_correct: boolean) => {
    const nextIndex = state.currentLetterIndex + 1;
    setTimeout(() => {
      if (nextIndex >= LETTERS.length) {
        setState(s => ({ ...s, phase: 'menu' }));
      } else {
        setState(s => ({
          ...s,
          phase: 'tracing',
          currentLetterIndex: nextIndex,
          attempts: 0,
          accuracy: 0,
          miniGameCorrect: null,
        }));
        setTracerKey(k => k + 1);
      }
    }, 1600);
  }, [state.currentLetterIndex]);

  const renderPhase = (): React.ReactNode => {
    switch (state.phase) {
      case 'menu':
        return (
          <GameMenu
            letters={LETTERS}
            letterProgress={state.letterProgress}
            onSelectLetter={selectLetter}
          />
        );

      case 'tracing':
        return (
          <div className="game-screen">
            <div className="game-screen-header">
              <button className="btn-back" onClick={goToMenu} aria-label="Back to menu">←</button>
              <ProgressBar letters={LETTERS} currentIndex={state.currentLetterIndex} />
            </div>

            <div className="letter-info">
              <h2 className="letter-display" style={{ color: currentLetter.color }}>
                {currentLetter.letter}
              </h2>
              <div className="letter-example">
                <span className="letter-emoji">{currentLetter.emoji}</span>
                <span className="letter-word">{currentLetter.word}</span>
              </div>
            </div>

            <CanvasTracer
              key={tracerKey}
              letterData={currentLetter}
              showHint={state.attempts >= 1}
              onCheck={handleCheck}
            />

            {state.attempts > 0 && (
              <p className="attempt-counter">
                Attempt {state.attempts} of {MAX_ATTEMPTS} — keep tracing!
              </p>
            )}
          </div>
        );

      case 'result':
        return (
          <div className="game-screen">
            <div className="game-screen-header">
              <button className="btn-back" onClick={goToMenu} aria-label="Back to menu">←</button>
            </div>
            <ResultScreen
              letterLabel={currentLetter.letter}
              accuracy={state.accuracy}
              attempts={state.attempts}
              onRetry={handleRetry}
              onContinue={handleResultContinue}
            />
          </div>
        );

      case 'minigame':
        return (
          <div className="game-screen">
            <div className="game-screen-header">
              <button className="btn-back" onClick={goToMenu} aria-label="Back to menu">←</button>
              <span className="minigame-badge">🎮 Word Game</span>
            </div>
            <MiniGame
              question={currentQuestion}
              letterColor={currentLetter.color}
              onComplete={handleMiniGameComplete}
            />
          </div>
        );
    }
  };

  return (
    <div className="app-wrapper">
      <div className="game-container">{renderPhase()}</div>
    </div>
  );
}

