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

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <h2>Viewed By</h2>

        <div className={styles.list}>
          {Object.entries(seen).map(([uid, value]) => (
            <div key={uid} className={styles.row}>
              <span className={styles.user}>{value.username}</span>
              <span className={styles.status}>{value ? "✓" : "✗"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
