import React, { useEffect, useState } from 'react';
import { accuracyToStars } from '../utils/accuracy';
import { playFeedback } from '../utils/audio';

interface ResultScreenProps {
  letterLabel: string;
  labelName?: string;
  accuracy: number;
  attempts: number;
  onRetry: () => void;
  onContinue: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  letterLabel,
  labelName = 'Letter',
  accuracy,
  attempts,
  onRetry,
  onContinue,
}) => {
  const stars = accuracyToStars(accuracy);
  const passed = stars > 0;
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setAnimate(true);
      playFeedback(passed ? 'great_job' : 'try_again');
    }, 100);
    return () => clearTimeout(t);
  }, [passed]);

  return (
    <div className={`result-screen ${animate ? 'visible' : ''}`}>
      <div className="result-card">
        {passed ? (
          <>
            <div className="result-emoji result-success">🎉</div>
            <h2 className="result-title success-text">Awesome!</h2>
          </>
        ) : (
          <>
            <div className="result-emoji result-retry">😅</div>
            <h2 className="result-title retry-text">Keep trying!</h2>
          </>
        )}

        <p className="result-letter">{labelName} {letterLabel}</p>

        {/* Accuracy bar */}
        <div className="accuracy-container">
          <div
            className="accuracy-bar"
            style={{
              width: `${accuracy}%`,
              background: passed ? '#26de81' : '#FF6B6B',
            }}
          />
        </div>
        <p className="accuracy-label">{accuracy}% accuracy</p>

        {/* Stars */}
        <div className="stars-row">
          {[1, 2, 3].map(s => (
            <span
              key={s}
              className={`star ${animate && s <= stars ? 'star-lit' : ''}`}
              style={{ animationDelay: `${(s - 1) * 0.18}s` }}
            >
              ⭐
            </span>
          ))}
        </div>

        {passed ? (
          <button className="btn btn-continue" onClick={onContinue}>
            Continue →
          </button>
        ) : (
          <>
            <button className="btn btn-retry" onClick={onRetry}>
              Try Again
            </button>
            {attempts >= 3 && (
              <button className="btn btn-skip" onClick={onContinue}>
                Skip for now
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResultScreen;
