import styles from './PhraseCard.module.css';
import type { FlamePhrase } from '../types/phrase';

interface Props {
  phrase: FlamePhrase;
}

export function PhraseCard({ phrase }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <span>炎</span>
        </div>
        <div className={styles.userInfo}>
          <span className={styles.displayName}>炎上タイパー</span>
          <span className={styles.handle}>@flame_typer</span>
        </div>
      </div>
      <div className={styles.content}>
        {phrase.display}
      </div>
      <div className={styles.inputLabel}>このコメントを投稿せよ</div>
    </div>
  );
}
