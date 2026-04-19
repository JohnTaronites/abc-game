import React, { useState } from 'react';
import type { QuestionData, AnswerOption } from '../types';

interface MiniGameProps {
  question: QuestionData;
  letterColor: string;
  onComplete: (correct: boolean) => void;
}

type AnswerState = 'idle' | 'correct' | 'wrong';

const MiniGame: React.FC<MiniGameProps> = ({ question, letterColor, onComplete }) => {
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [selectedOption, setSelectedOption] = useState<AnswerOption | null>(null);

  const handleAnswer = (option: AnswerOption) => {
    if (answerState !== 'idle') return; // prevent double-click
    setSelectedOption(option);
    setAnswerState(option.isCorrect ? 'correct' : 'wrong');
    // Give the user a moment to see the feedback, then proceed
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
