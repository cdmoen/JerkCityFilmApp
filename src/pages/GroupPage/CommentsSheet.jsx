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
      setComments(snap.exists() ? Object.values(snap.val()) : []);
    });
  }, [isOpen, groupId, filmId]);

  function addComment() {
    if (!text.trim()) return;
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

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addComment();
    }
  }

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.handle} />

        <div className={styles.header}>
          <p className={styles.eyebrow}>Discussion</p>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>Comments</h2>
            <button className={styles.backBtn} onClick={onClose}>
              ← Back
            </button>
          </div>
        </div>

        <div className={styles.list}>
          {comments.length === 0 ? (
            <p className={styles.empty}>
              No comments yet. Start the conversation.
            </p>
          ) : (
            comments.map((c, i) => (
              <CommentCard
                key={i}
                avatarUrl={c.avatarUrl || null}
                username={c.username || c.uid}
                text={c.text}
              />
            ))
          )}
        </div>

        <div className={styles.inputRow}>
          <input
            className={styles.input}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment…"
          />
          <button
            className={styles.sendBtn}
            onClick={addComment}
            disabled={!text.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
