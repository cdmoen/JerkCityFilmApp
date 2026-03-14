import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./GroupCard.module.css";

export default function GroupCard({ group, onDelete, onInvite }) {
  const navigate = useNavigate();

  return (
    <main className={styles.card}>
      <div className={styles.header}>
        <button
          className={styles.nameButton}
          onClick={() => navigate(`/groups/${group.id}`)}
        >
          {group.name}
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
            onClick={() => onDelete(group)}
          >
            Delete Group
          </button>
        </div>
      </div>

      <div className={styles.meta}>
        <span>Created: {new Date(group.createdAt).toLocaleString()}</span>
      </div>
    </main>
  );
}
