import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../modules/firebase";
import styles from "./RatingsSheet.module.css";

export default function RatingsSheet({
  isOpen,
  onClose,
  groupId,
  film,
  friends,
}) {
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    if (!isOpen || !film) return;
    const ratingsRef = ref(
      database,
      `groups/${groupId}/films/${film.id}/ratings`
    );
    return onValue(ratingsRef, (snap) => {
      setRatings(snap.exists() ? snap.val() : {});
    });
  }, [isOpen, groupId, film]);

  if (!isOpen || !film) return null;

  const entries = Object.entries(ratings);
  const average = entries.length
    ? (
        entries.reduce((sum, [, v]) => sum + v.rating, 0) / entries.length
      ).toFixed(1)
    : null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.handle} />

        <div className={styles.header}>
          <div className={styles.headerTop}>
            <p className={styles.eyebrow}>Group scores</p>
            <button className={styles.closeBtn} onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>{film.title}</h2>
            {average && (
              <div className={styles.average}>
                <span className={styles.avgNumber}>{average}</span>
                <span className={styles.avgStar}>★</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.body}>
          {entries.length === 0 ? (
            <p className={styles.empty}>No ratings yet.</p>
          ) : (
            <div className={styles.list}>
              {entries.map(([uid, value]) => (
                <div key={uid} className={styles.row}>
                  <div className={styles.avatar}>
                    {value.username?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <span className={styles.username}>{value.username}</span>
                  <div className={styles.stars}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        className={n <= value.rating ? styles.starFilled : styles.starEmpty}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className={styles.ratingNum}>{value.rating}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
