import type { GameResult } from '../types/game';
import styles from './ResultScreen.module.css';

interface Props {
  result: GameResult;
  isNewHighScore: boolean;
  onRetry: () => void;
  onBackToTitle: () => void;
}

export function ResultScreen({ result, isNewHighScore, onRetry, onBackToTitle }: Props) {
  const rankClass = styles[`rank${result.rank}`] || '';

  // 苦手キーの上位5つ
  const weakKeys = Object.entries(result.missedKeys)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>RESULT</h2>

      {isNewHighScore && <div className={styles.newRecord}>NEW HIGH SCORE!</div>}

      <div className={`${styles.rank} ${rankClass}`}>
        {result.rank}
      </div>

      <div className={styles.score}>
        {result.score.toLocaleString()}
        <span className={styles.scoreUnit}>pts</span>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>投稿数</span>
          <span className={styles.statValue}>{result.phraseCount}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>WPM</span>
          <span className={styles.statValue}>{result.wpm}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>正確率</span>
          <span className={styles.statValue}>{result.accuracy}%</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>最大コンボ</span>
          <span className={styles.statValue}>{result.maxCombo}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>正解打鍵</span>
          <span className={styles.statValue}>{result.correctCount}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>ミス</span>
          <span className={`${styles.statValue} ${result.missCount > 0 ? styles.missValue : ''}`}>
            {result.missCount}
          </span>
        </div>
      </div>

      {weakKeys.length > 0 && (
        <div className={styles.weakKeys}>
          <h3 className={styles.weakKeysTitle}>苦手キー</h3>
          <div className={styles.weakKeysList}>
            {weakKeys.map(([key, count]) => (
              <div key={key} className={styles.weakKey}>
                <span className={styles.keyChar}>{key}</span>
                <span className={styles.keyCount}>{count}回</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <button className={styles.retryButton} onClick={onRetry}>
          RETRY
        </button>
        <button className={styles.titleButton} onClick={onBackToTitle}>
          TITLE
        </button>
      </div>
    </div>
  );
}
