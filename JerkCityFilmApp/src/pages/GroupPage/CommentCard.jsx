import styles from "./CommentCard.module.css";

export default function CommentCard({ avatarUrl, username, text }) {
  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <img src={avatarUrl} alt={username} className={styles.avatar} />
        <div className={styles.username}>{username}</div>
      </div>

      <div className={styles.right}>
        <div className={styles.comment}>{text}</div>
      </div>
    </div>
  );
}
