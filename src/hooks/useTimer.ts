import { useState, useEffect, useCallback, useRef } from 'react';

export function useTimer(initialSeconds: number, onTimeUp: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(id);
          setIsRunning(false);
          onTimeUpRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, timeLeft]);

  const start = useCallback(() => setIsRunning(true), []);
  const stop = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setTimeLeft(initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  return { timeLeft, isRunning, start, stop, reset };
}
