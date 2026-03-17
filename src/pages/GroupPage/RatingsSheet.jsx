import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../modules/firebase";
import styles from "./RatingsSheet.module.css";

export default function RatingsSheet({
  isOpen,
  onClose,
  groupId,
  filmId,
  profile,
}) {
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    const ratingsRef = ref(
      database,
      `groups/${groupId}/films/${filmId}/ratings`,
    );
    return onValue(ratingsRef, (snap) => {
      setRatings(snap.exists() ? snap.val() : {});
    });
  }, [isOpen, groupId, filmId]);

  if (!isOpen) return null;

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
          <p className={styles.eyebrow}>Group scores</p>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>Ratings</h2>
            {average && (
              <div className={styles.average}>
                <span className={styles.avgNumber}>{average}</span>
                <span className={styles.avgStar}>★</span>
                <span className={styles.avgLabel}>avg</span>
              </div>
            )}
          </div>
        </div>

        {entries.length === 0 ? (
          <p className={styles.empty}>No ratings yet.</p>
        ) : (
          <div className={styles.list}>
            {entries.map(([uid, value]) => (
              <div key={uid} className={styles.row}>
                <div className={styles.avatar}>
                  {value.username?.[0]?.toUpperCase() ?? "?"}
                </div>
                <span className={styles.user}>{value.username}</span>
                <div className={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className={
                        n <= value.rating ? styles.starFilled : styles.starEmpty
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className={styles.ratingNumber}>{value.rating}</span>
              </div>
            ))}
          </div>
        )}

        <button className={styles.closeBtn} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
