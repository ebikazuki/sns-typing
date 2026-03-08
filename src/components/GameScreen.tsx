import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameResult } from '../types/game';
import { getRank } from '../types/game';
import { flameThreads } from '../data/flamePhrases';
import { generateQuestions } from '../utils/questionGenerator';
import { useTimer } from '../hooks/useTimer';
import { useScore } from '../hooks/useScore';
import { useTyping } from '../hooks/useTyping';
import { GameHeader } from './GameHeader';
import { PhraseCard } from './PhraseCard';
import { TypingArea } from './TypingArea';
import styles from './GameScreen.module.css';

const GAME_DURATION = 60;

interface Props {
  onGameEnd: (result: GameResult) => void;
}

export function GameScreen({ onGameEnd }: Props) {
  const [questions] = useState(() => generateQuestions(flameThreads, 30));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [missedKeysAll, setMissedKeysAll] = useState<Record<string, number>>({});
  const { state: scoreState, dispatch: scoreDispatch } = useScore();
  const scoreStateRef = useRef(scoreState);
  scoreStateRef.current = scoreState;
  const missedKeysRef = useRef(missedKeysAll);
  missedKeysRef.current = missedKeysAll;

  const handleTimeUp = useCallback(() => {
    const s = scoreStateRef.current;
    const totalKeys = s.correctCount + s.missCount;
    const wpm = Math.round((s.correctCount / GAME_DURATION) * 60 / 5);
    const accuracy = totalKeys > 0 ? Math.round((s.correctCount / totalKeys) * 100) : 0;

    onGameEnd({
      score: s.score,
      correctCount: s.correctCount,
      missCount: s.missCount,
      phraseCount: s.phraseCount,
      maxCombo: s.combo.max,
      wpm,
      accuracy,
      rank: getRank(s.score),
      missedKeys: missedKeysRef.current,
    });
  }, [onGameEnd]);

  const timer = useTimer(GAME_DURATION, handleTimeUp);

  const currentQuestion = questions[questionIndex] ?? null;

  const handleCorrect = useCallback(() => {
    scoreDispatch({ type: 'CORRECT' });
  }, [scoreDispatch]);

  const handleMiss = useCallback(() => {
    scoreDispatch({ type: 'MISS' });
  }, [scoreDispatch]);

  const handlePhraseComplete = useCallback(() => {
    scoreDispatch({ type: 'PHRASE_COMPLETE' });
    setQuestionIndex(prev => prev + 1);
  }, [scoreDispatch]);

  const { inputState, displaySegments, kanaProgress } = useTyping(
    currentQuestion?.reply ?? null,
    started,
    { onCorrect: handleCorrect, onMiss: handleMiss, onPhraseComplete: handlePhraseComplete }
  );

  // ミスキーを集約
  useEffect(() => {
    if (inputState) {
      setMissedKeysAll(inputState.missedKeys);
    }
  }, [inputState?.missedKeys]);

  // 最初のキー入力でタイマー開始
  useEffect(() => {
    if (started) return;

    const handleFirstKey = (e: KeyboardEvent) => {
      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setStarted(true);
        timer.start();
      }
    };

    window.addEventListener('keydown', handleFirstKey);
    return () => window.removeEventListener('keydown', handleFirstKey);
  }, [started, timer]);

  return (
    <div className={styles.container}>
      <GameHeader
        timeLeft={timer.timeLeft}
        score={scoreState.score}
        combo={scoreState.combo}
      />
      {currentQuestion && <PhraseCard question={currentQuestion} />}
      <TypingArea
        kanaProgress={kanaProgress}
        displaySegments={displaySegments}
      />
      {!started && (
        <div className={styles.startHint}>
          何かキーを押してスタート
        </div>
      )}
    </div>
  );
}
