import styles from './TypingArea.module.css';

interface Props {
  kanaProgress: { completed: string; remaining: string } | null;
  displaySegments: { typed: string; current: string; remaining: string } | null;
}

export function TypingArea({ kanaProgress, displaySegments }: Props) {
  if (!kanaProgress || !displaySegments) return null;

  return (
    <div className={styles.area}>
      <div className={styles.kanaRow}>
        <span className={styles.kanaCompleted}>{kanaProgress.completed}</span>
        <span className={styles.kanaRemaining}>{kanaProgress.remaining}</span>
      </div>
      <div className={styles.romajiRow}>
        <span className={styles.romajiTyped}>{displaySegments.typed}</span>
        <span className={styles.romajiCurrent}>{displaySegments.current}</span>
        <span className={styles.romajiRemaining}>{displaySegments.remaining}</span>
      </div>
    </div>
  );
}
