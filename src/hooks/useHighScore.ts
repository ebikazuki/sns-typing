import { useState, useCallback } from 'react';

const STORAGE_KEY = 'sns-typing-highscore';

export function useHighScore() {
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  const updateHighScore = useCallback((score: number) => {
    setHighScore(prev => {
      if (score > prev) {
        try {
          localStorage.setItem(STORAGE_KEY, String(score));
        } catch { /* ignore */ }
        return score;
      }
      return prev;
    });
  }, []);

  return { highScore, updateHighScore };
}
