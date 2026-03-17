import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../modules/firebase";
import styles from "./SeenSheet.module.css";

export default function SeenSheet({ isOpen, onClose, groupId, filmId }) {
  const [seen, setSeen] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    const seenRef = ref(database, `groups/${groupId}/films/${filmId}/seen`);
    return onValue(seenRef, (snap) => {
      setSeen(snap.exists() ? snap.val() : {});
    });
  }, [isOpen, groupId, filmId]);

  if (!isOpen) return null;

  const entries = Object.entries(seen);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.handle} />

        <div className={styles.header}>
          <p className={styles.eyebrow}>Film activity</p>
          <h2 className={styles.title}>
            Viewed <span>By</span>
          </h2>
        </div>

        {entries.length === 0 ? (
          <p className={styles.empty}>Nobody has viewed this yet.</p>
        ) : (
          <div className={styles.list}>
            {entries.map(([uid, value]) => (
              <div key={uid} className={styles.row}>
                <div className={styles.avatar}>
                  {value.username?.[0]?.toUpperCase() ?? "?"}
                </div>
                <span className={styles.user}>{value.username}</span>
                <span className={styles.status}>
                  {value ? (
                    <span className={styles.seen}>✓ Seen</span>
                  ) : (
                    <span className={styles.unseen}>✗ Not yet</span>
                  )}
                </span>
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
