import { useEffect, useState } from "react";
import { ref, onValue, push } from "firebase/database";
import { database } from "../../modules/firebase";
import CommentCard from "./CommentCard";
import styles from "./CommentsSheet.module.css";

export default function CommentsSheet({
  isOpen,
  onClose,
  groupId,
  filmId,
  uid,
  profile,
}) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const commentsRef = ref(
      database,
      `groups/${groupId}/films/${filmId}/comments`,
    );
    return onValue(commentsRef, (snap) => {
      if (snap.exists()) {
        setComments(Object.values(snap.val()));
      } else {
        setComments([]);
      }
    });
  }, [isOpen, groupId, filmId]);

  function addComment() {
    const commentsRef = ref(
      database,
      `groups/${groupId}/films/${filmId}/comments`,
    );
    push(commentsRef, {
      uid,
      text,
      username: profile.username,
      avatarUrl: profile.avatarUrl,
      timestamp: Date.now(),
    });
    setText("");
  }

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <h2>Comments</h2>

        <div className={styles.list}>
          {comments.map((c, i) => (
            <CommentCard
              key={i}
              avatarUrl={c.avatarUrl || "/default-avatar.png"}
              username={c.username || c.uid}
              text={c.text}
            />
          ))}
        </div>

        <div className={styles.inputRow}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment…"
          />
          <button onClick={addComment}>Send</button>
        </div>
      </div>
    </div>
  );
}
