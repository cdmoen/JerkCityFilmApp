import styles from "./HomePage.module.css";

export default function WatchlistCard({ onOpen }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>My Watchlist</h2>

      <div className={styles.cardRow}>
        <img
          src="/images/glasses.png"
          alt="Watchlist Icon"
          title="Watchlist"
          className={styles.cardIcon}
        />
        <p className={styles.cardContent}>
          The movies you want to watch. Your personal watchlist!
        </p>
      </div>

      <button className={styles.cardBtn} onClick={onOpen}>
        My Watchlist
      </button>
    </div>
  );
}
