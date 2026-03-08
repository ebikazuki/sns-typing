import { useState, useEffect, useCallback, useRef } from 'react';
import type { InputState } from '../types/romaji';
import type { FlamePhrase } from '../types/phrase';
import { parseToChunks } from '../utils/chunkParser';
import { createInputState, judgeKeyPress } from '../utils/inputJudge';
import { getDisplaySegments, getKanaProgress } from '../utils/displayRomaji';

interface UseTypingCallbacks {
  onCorrect: () => void;
  onMiss: () => void;
  onPhraseComplete: () => void;
}

export function useTyping(
  phrase: FlamePhrase | null,
  active: boolean,
  callbacks: UseTypingCallbacks
) {
  const [inputState, setInputState] = useState<InputState | null>(null);
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  // フレーズが変わったら入力状態をリセット
  useEffect(() => {
    if (phrase) {
      const chunks = parseToChunks(phrase.kana);
      setInputState(createInputState(chunks));
    } else {
      setInputState(null);
    }
  }, [phrase]);

  // キーボードイベントハンドラ
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // IME入力、修飾キー、特殊キーを無視
    if (e.isComposing || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key.length !== 1) return;

    e.preventDefault();

    setInputState(prev => {
      if (!prev) return prev;

      const [newState, result] = judgeKeyPress(prev, e.key);

      if (result.type === 'correct') {
        callbacksRef.current.onCorrect();
        if (result.phraseCompleted) {
          callbacksRef.current.onPhraseComplete();
        }
      } else {
        callbacksRef.current.onMiss();
      }

      return newState;
    });
  }, []);

  useEffect(() => {
    if (!active || !inputState) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, handleKeyDown, inputState]);

  const displaySegments = inputState ? getDisplaySegments(inputState) : null;
  const kanaProgress = inputState ? getKanaProgress(inputState) : null;

  return {
    inputState,
    displaySegments,
    kanaProgress,
  };
}
