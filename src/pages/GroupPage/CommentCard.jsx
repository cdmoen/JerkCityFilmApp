import styles from "./CommentCard.module.css";

export default function CommentCard({ avatarUrl, username, text, isOwn }) {
  const initial = username?.[0]?.toUpperCase() ?? "?";

  return (
    <div className={`${styles.card} ${isOwn ? styles.own : ""}`}>
      {!isOwn && (
        <div className={styles.avatarWrap}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={username} className={styles.avatarImg} />
          ) : (
            <div className={styles.avatarInitial}>{initial}</div>
          )}
        </div>
      )}
      <div className={styles.bubble}>
        {!isOwn && (
          <p className={styles.username}>{username}</p>
        )}
        <p className={styles.text}>{text}</p>
      </div>
    </div>
  );
}
