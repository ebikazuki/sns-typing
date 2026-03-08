import styles from './TitleScreen.module.css';

interface Props {
  highScore: number;
  onStart: () => void;
}

export function TitleScreen({ highScore, onStart }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <span className={styles.flame}>SNS</span>
        <span className={styles.title}>炎上タイピング</span>
      </div>
      <p className={styles.subtitle}>炎上コメントを高速タイピングで投稿せよ</p>
      <button className={styles.startButton} onClick={onStart}>
        START
      </button>
      {highScore > 0 && (
        <div className={styles.highScore}>
          HIGH SCORE: {highScore.toLocaleString()}
        </div>
      )}
      <div className={styles.instructions}>
        <p>60秒以内にできるだけ多くの炎上コメントをタイピング！</p>
        <p>ミスなし連続でコンボボーナス</p>
      </div>
    </div>
  );
}
