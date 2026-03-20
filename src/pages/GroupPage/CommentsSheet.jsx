import { useEffect, useState } from "react";
import { ref, onValue, push } from "firebase/database";
import { database } from "../../modules/firebase";
import CommentCard from "./CommentCard";
import styles from "./CommentsSheet.module.css";

export default function CommentsSheet({
  isOpen,
  onClose,
  groupId,
  film,
  uid,
  profile,
}) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!isOpen || !film) return;
    const commentsRef = ref(
      database,
      `groups/${groupId}/films/${film.id}/comments`
    );
    return onValue(commentsRef, (snap) => {
      setComments(snap.exists() ? Object.values(snap.val()) : []);
    });
  }, [isOpen, groupId, film]);

  function addComment() {
    if (!text.trim() || !profile) return;
    const commentsRef = ref(
      database,
      `groups/${groupId}/films/${film.id}/comments`
    );
    push(commentsRef, {
      uid,
      text: text.trim(),
      username: profile.username,
      avatarUrl: profile.avatarUrl ?? null,
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

  if (!isOpen || !film) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.handle} />

        <div className={styles.header}>
          <div className={styles.headerTop}>
            <p className={styles.eyebrow}>Discussion</p>
            <button className={styles.closeBtn} onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <h2 className={styles.title}>{film.title}</h2>
        </div>

        <div className={styles.list}>
          {comments.length === 0 ? (
            <p className={styles.empty}>No comments yet. Start the conversation.</p>
          ) : (
            comments
              .sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0))
              .map((c, i) => (
                <CommentCard
                  key={i}
                  avatarUrl={c.avatarUrl ?? null}
                  username={c.username ?? c.uid}
                  text={c.text}
                  isOwn={c.uid === uid}
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
