import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../modules/firebase";
import styles from "./SeenSheet.module.css";

export default function SeenSheet({
  isOpen,
  onClose,
  groupId,
  film,
  friends,
}) {
  const [seen, setSeen] = useState({});

  useEffect(() => {
    if (!isOpen || !film) return;
    const seenRef = ref(
      database,
      `groups/${groupId}/films/${film.id}/seen`
    );
    return onValue(seenRef, (snap) => {
      setSeen(snap.exists() ? snap.val() : {});
    });
  }, [isOpen, groupId, film]);

  if (!isOpen || !film) return null;

  const entries = Object.entries(seen);
  const seenCount = entries.length;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.handle} />

        <div className={styles.header}>
          <div className={styles.headerTop}>
            <p className={styles.eyebrow}>Film activity</p>
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
            {seenCount > 0 && (
              <span className={styles.seenCount}>
                {seenCount} {seenCount === 1 ? "person" : "people"}
              </span>
            )}
          </div>
        </div>

        <div className={styles.body}>
          {entries.length === 0 ? (
            <p className={styles.empty}>Nobody has seen this yet.</p>
          ) : (
            <div className={styles.list}>
              {entries.map(([uid, value]) => (
                <div key={uid} className={styles.row}>
                  <div className={styles.avatar}>
                    {value.username?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <span className={styles.username}>{value.username}</span>
                  <span className={styles.seenBadge}>✓ Seen</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
