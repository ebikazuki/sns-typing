import { useReducer } from 'react';
import type { ScoreState } from '../types/game';
import { getComboMultiplier } from '../types/game';

type ScoreAction =
  | { type: 'CORRECT' }
  | { type: 'MISS' }
  | { type: 'PHRASE_COMPLETE' }
  | { type: 'RESET' };

const initialState: ScoreState = {
  score: 0,
  combo: { current: 0, max: 0, multiplier: 1.0 },
  correctCount: 0,
  missCount: 0,
  phraseCount: 0,
};

function scoreReducer(state: ScoreState, action: ScoreAction): ScoreState {
  switch (action.type) {
    case 'CORRECT': {
      const newCombo = state.combo.current + 1;
      const multiplier = getComboMultiplier(newCombo);
      const points = Math.floor(10 * multiplier);
      return {
        ...state,
        score: state.score + points,
        correctCount: state.correctCount + 1,
        combo: {
          current: newCombo,
          max: Math.max(state.combo.max, newCombo),
          multiplier,
        },
      };
    }
    case 'MISS':
      return {
        ...state,
        missCount: state.missCount + 1,
        combo: { ...state.combo, current: 0, multiplier: 1.0 },
      };
    case 'PHRASE_COMPLETE':
      return {
        ...state,
        score: state.score + 100,
        phraseCount: state.phraseCount + 1,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useScore() {
  const [state, dispatch] = useReducer(scoreReducer, initialState);
  return { state, dispatch };
}
