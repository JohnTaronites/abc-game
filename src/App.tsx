import React, { useState, useEffect, useCallback } from 'react';
import type { AppState, GameMode, LetterData, LetterProgress, QuestionData } from './types';
import { LETTERS } from './data/letters';
import { QUESTIONS } from './data/questions';
import { NUMBERS, NUMBER_QUESTIONS } from './data/numbers';
import { accuracyToStars } from './utils/accuracy';
import { playNumber, playWord } from './utils/audio';
import GameMenu from './components/GameMenu';
import ModeSelector from './components/ModeSelector';
import CanvasTracer from './components/CanvasTracer';
import ResultScreen from './components/ResultScreen';
import MiniGame from './components/MiniGame';
import ProgressBar from './components/ProgressBar';
import './App.css';

const STORAGE_KEYS: Record<GameMode, string> = { abc: 'abc-game-progress', numbers: '123-game-progress' };
const MAX_ATTEMPTS = 3;

interface GameConfig {
  items: LetterData[];
  questions: QuestionData[];
  title: string;
  subtitle: string;
  itemName: string;
  resultLabel: string;
}

const GAME_CONFIG: Record<GameMode, GameConfig> = {
  abc: { items: LETTERS, questions: QUESTIONS, title: '🔤 ABC Tracing', subtitle: 'Learn to write all the letters!', itemName: 'letters', resultLabel: 'Letter' },
  numbers: { items: NUMBERS, questions: NUMBER_QUESTIONS, title: '🔢 123 Tracing', subtitle: 'Learn to write numbers from 0 to 20!', itemName: 'numbers', resultLabel: 'Number' },
};

function loadProgress(mode: GameMode): LetterProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[mode]);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const defaultState = (): AppState => ({
  phase: 'mode-select', mode: null, currentLetterIndex: 0, accuracy: 0, attempts: 0,
  miniGameCorrect: null, letterProgress: {}, totalScore: 0,
});

export default function App() {
  const [state, setState] = useState<AppState>(defaultState);
  const [tracerKey, setTracerKey] = useState(0);
  const config = state.mode ? GAME_CONFIG[state.mode] : null;
  const currentItem = config?.items[state.currentLetterIndex];
  const currentQuestion = config?.questions[state.currentLetterIndex];

  useEffect(() => {
    if (state.mode) localStorage.setItem(STORAGE_KEYS[state.mode], JSON.stringify(state.letterProgress));
  }, [state.letterProgress, state.mode]);

  const chooseMode = useCallback((mode: GameMode) => {
    setState(s => ({ ...s, phase: 'menu', mode, currentLetterIndex: 0, accuracy: 0, attempts: 0, miniGameCorrect: null, letterProgress: loadProgress(mode) }));
  }, []);

  const goToGameChoice = useCallback(() =>
    setState(s => ({ ...s, phase: 'mode-select', mode: null, attempts: 0, accuracy: 0, miniGameCorrect: null })), []);
  const goToMenu = useCallback(() =>
    setState(s => ({ ...s, phase: 'menu', attempts: 0, accuracy: 0, miniGameCorrect: null })), []);

  const selectItem = useCallback((index: number) => {
    if (!state.mode) return;
    setState(s => ({ ...s, phase: 'tracing', currentLetterIndex: index, attempts: 0, accuracy: 0 }));
    setTracerKey(k => k + 1);
    setTimeout(() => {
      if (state.mode === 'numbers') playNumber(String(index));
      else playWord(LETTERS[index].word);
    }, 400);
  }, [state.mode]);

  const handleCheck = useCallback((accuracy: number) => {
    setState(s => ({ ...s, phase: 'result', accuracy, attempts: s.attempts + 1 }));
  }, []);
  const handleRetry = useCallback(() => {
    setState(s => ({ ...s, phase: 'tracing' }));
    setTracerKey(k => k + 1);
  }, []);

  const handleResultContinue = useCallback(() => {
    if (!currentItem) return;
    const stars = accuracyToStars(state.accuracy);
    const previousStars = state.letterProgress[currentItem.letter] ?? 0;
    setState(s => ({ ...s, phase: 'minigame', letterProgress: { ...s.letterProgress, [currentItem.letter]: Math.max(previousStars, stars) } }));
  }, [state.accuracy, state.letterProgress, currentItem]);

  const handleMiniGameComplete = useCallback(() => {
    if (!config) return;
    const nextIndex = state.currentLetterIndex + 1;
    setTimeout(() => {
      if (nextIndex >= config.items.length) setState(s => ({ ...s, phase: 'menu' }));
      else {
        setState(s => ({ ...s, phase: 'tracing', currentLetterIndex: nextIndex, attempts: 0, accuracy: 0, miniGameCorrect: null }));
        setTracerKey(k => k + 1);
      }
    }, 1600);
  }, [config, state.currentLetterIndex]);

  const renderPhase = (): React.ReactNode => {
    if (state.phase === 'mode-select') return <ModeSelector onSelect={chooseMode} />;
    if (!config || !currentItem || !currentQuestion) return null;

    switch (state.phase) {
      case 'menu':
        return <GameMenu letters={config.items} letterProgress={state.letterProgress} onSelectLetter={selectItem} onBack={goToGameChoice} title={config.title} subtitle={config.subtitle} itemName={config.itemName} />;
      case 'tracing':
        return <div className="game-screen">
          <div className="game-screen-header"><button className="btn-back" onClick={goToMenu} aria-label="Back to menu">←</button><ProgressBar letters={config.items} currentIndex={state.currentLetterIndex} /></div>
          <div className="letter-info"><h2 className="letter-display" style={{ color: currentItem.color }}>{currentItem.letter}</h2><div className="letter-example"><span className="letter-emoji">{currentItem.emoji}</span><span className="letter-word">{currentItem.word}</span></div></div>
          <CanvasTracer key={tracerKey} letterData={currentItem} showHint={state.attempts >= 1} onCheck={handleCheck} />
          {state.attempts > 0 && <p className="attempt-counter">Attempt {state.attempts} of {MAX_ATTEMPTS} — keep tracing!</p>}
        </div>;
      case 'result':
        return <div className="game-screen"><div className="game-screen-header"><button className="btn-back" onClick={goToMenu} aria-label="Back to menu">←</button></div><ResultScreen letterLabel={currentItem.letter} labelName={config.resultLabel} accuracy={state.accuracy} attempts={state.attempts} onRetry={handleRetry} onContinue={handleResultContinue} /></div>;
      case 'minigame':
        return <div className="game-screen"><div className="game-screen-header"><button className="btn-back" onClick={goToMenu} aria-label="Back to menu">←</button><span className="minigame-badge">🎮 {state.mode === 'numbers' ? 'Number Game' : 'Word Game'}</span></div><MiniGame question={currentQuestion} letterColor={currentItem.color} onComplete={handleMiniGameComplete} /></div>;
    }
  };

  return <div className="app-wrapper"><div className="game-container">{renderPhase()}</div></div>;
}
