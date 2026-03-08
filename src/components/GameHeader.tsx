import styles from './GameHeader.module.css';
import type { ComboState } from '../types/game';

interface Props {
  timeLeft: number;
  score: number;
  combo: ComboState;
}

export function GameHeader({ timeLeft, score, combo }: Props) {
  const isUrgent = timeLeft <= 10;

  return (
    <div className={styles.header}>
      <div className={`${styles.timer} ${isUrgent ? styles.urgent : ''}`}>
        {timeLeft}s
      </div>
      <div className={styles.score}>
        {score.toLocaleString()}
        <span className={styles.scoreLabel}>pts</span>
      </div>
      {combo.current >= 5 && (
        <div className={styles.combo}>
          <span className={styles.comboCount}>{combo.current}</span>
          <span className={styles.comboLabel}>COMBO</span>
          {combo.multiplier > 1 && (
            <span className={styles.multiplier}>x{combo.multiplier}</span>
          )}
        </div>
      )}
    </div>
  );
}
