import React, { useState, useEffect } from 'react';
import type { QuestionData, AnswerOption } from '../types';
import { playWord, playNumber, playFeedback } from '../utils/audio';

interface MiniGameProps {
  question: QuestionData;
  letterColor: string;
  onComplete: (correct: boolean) => void;
}

type AnswerState = 'idle' | 'correct' | 'wrong';

const MiniGame: React.FC<MiniGameProps> = ({ question, letterColor, onComplete }) => {
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [selectedOption, setSelectedOption] = useState<AnswerOption | null>(null);

  // Play the correct word when the question appears (short delay so UI renders first)
  useEffect(() => {
    const audioKey = question.audioKey;
    const correctWord = question.options.find(o => o.isCorrect)?.text;
    if (audioKey || correctWord) {
      const t = setTimeout(() => {
        if (audioKey) playNumber(audioKey);
        else if (correctWord) playWord(correctWord);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [question]);

  const handleAnswer = (option: AnswerOption) => {
    if (answerState !== 'idle') return;
    setSelectedOption(option);
    const result = option.isCorrect ? 'correct' : 'wrong';
    setAnswerState(result);
    playFeedback(result);
    setTimeout(() => onComplete(option.isCorrect), 1400);
  };

  const getOptionClass = (option: AnswerOption): string => {
    if (answerState === 'idle') return 'option-btn';
    if (option === selectedOption) {
      return `option-btn ${option.isCorrect ? 'option-correct' : 'option-wrong'}`;
    }
    if (option.isCorrect) return 'option-btn option-correct';
    return 'option-btn option-dimmed';
  };

  return (
    <div className="minigame">
      <div className="minigame-header">
        <span
          className="minigame-letter"
          style={{ color: letterColor, borderColor: letterColor }}
        >
          {question.letter}
        </span>
        <p className="minigame-question">{question.question}</p>
        {question.itemsToCount && (
          <div className="counting-items" aria-label={`${question.itemsToCount.length} items to count`}>
            {question.itemsToCount.map((emoji, index) => (
              <span key={index} className="counting-item">{emoji}</span>
            ))}
          </div>
        )}
      </div>

      <div className="options-grid">
        {question.options.map((option, i) => (
          <button
            key={i}
            className={getOptionClass(option)}
            style={
              answerState === 'idle'
                ? ({ '--option-color': letterColor } as React.CSSProperties)
                : undefined
            }
            onClick={() => handleAnswer(option)}
          >
            <span className="option-emoji">{option.emoji}</span>
            <span className="option-text">{option.text}</span>
          </button>
        ))}
      </div>

      {answerState !== 'idle' && (
        <div className={`minigame-feedback ${answerState === 'correct' ? 'feedback-correct' : 'feedback-wrong'}`}>
          {answerState === 'correct' ? '🎉 Correct! Great job!' : '❌ Not quite — try to remember!'}
        </div>
      )}
    </div>
  );
};

export default MiniGame;
