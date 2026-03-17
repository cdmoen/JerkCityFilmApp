import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GroupCard.module.css";

export default function GroupCard({ group, onDelete, onInvite }) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <main className={styles.card}>
      <div className={styles.header}>
        <button
          className={styles.nameButton}
          onClick={() => navigate(`/groups/${group.id}`)}
        >
          {group.name}
          {" →"}
        </button>

        <div className={styles.actions}>
          <button
            className={styles.inviteButton}
            onClick={() => onInvite(group)}
          >
            Invite Friend
          </button>

          <button
            className={styles.deleteButton}
            onClick={() => setShowConfirm(true)}
          >
            Delete Group
          </button>
        </div>
      </div>

      <div className={styles.meta}>
        <span>Created: {new Date(group.createdAt).toLocaleString()}</span>
      </div>

      {showConfirm && (
        <div className={styles.backdrop}>
          <div className={styles.modal}>
            <p className={styles.modalText}>
              Are you sure you want to delete <strong>{group.name}</strong>?
              This cannot be undone.
            </p>
            <div className={styles.modalButtons}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>

              {/* warning for deleting a group */}
              <button
                className={styles.confirmButton}
                onClick={() => {
                  onDelete(group);
                  setShowConfirm(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
