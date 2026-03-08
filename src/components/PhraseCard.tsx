import styles from './PhraseCard.module.css';
import type { GameQuestion } from '../types/phrase';

interface Props {
  question: GameQuestion;
}

export function PhraseCard({ question }: Props) {
  const isPostPhase = question.phase === 'post';

  return (
    <div className={styles.card}>
      <div className={`${styles.postSection} ${isPostPhase ? styles.activePhase : ''}`}>
        <div className={styles.header}>
          <div className={styles.avatar}>
            <span>炎</span>
          </div>
          <div className={styles.userInfo}>
            <span className={styles.displayName}>炎上太郎</span>
            <span className={styles.handle}>@enjou_taro</span>
          </div>
        </div>
        <div className={styles.postContent}>
          {question.post.display}
        </div>
        {isPostPhase && (
          <div className={styles.phaseLabel}>この投稿をタイピング</div>
        )}
      </div>
      {!isPostPhase && (
        <div className={styles.replySection}>
          <div className={styles.replyLabel}>
            返信 {question.replyIndex + 1}/{question.replyTotal}
          </div>
          <div className={styles.replyContent}>
            {question.reply.display}
          </div>
        </div>
      )}
    </div>
  );
}
