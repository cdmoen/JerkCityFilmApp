import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GroupCard.module.css";

function mostRecentFilm(group) {
  if (!group.films) return null;
  const films = Object.values(group.films);
  if (films.length === 0) return null;
  return films.sort((a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0))[0];
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return null;
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

export default function GroupCard({ group, uid, onDelete, onLeave, onInvite }) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState(null); // 'delete' | 'leave'

  const isOwner = group.createdBy === uid;
  const memberCount = group.members ? Object.keys(group.members).length : 0;
  const filmCount = group.films ? Object.keys(group.films).length : 0;
  const recent = mostRecentFilm(group);
  const lastActivity = recent?.addedAt ? formatTimeAgo(recent.addedAt) : null;

  function handleDeleteClick() {
    setConfirmType("delete");
    setShowConfirm(true);
  }

  function handleLeaveClick() {
    setConfirmType("leave");
    setShowConfirm(true);
  }

  function handleConfirm() {
    if (confirmType === "delete") onDelete(group);
    if (confirmType === "leave") onLeave(group);
    setShowConfirm(false);
    setConfirmType(null);
  }

  return (
    <div className={styles.card}>
      {/* ── Poster + Info ── */}
      <button
        className={styles.mainArea}
        onClick={() => navigate(`/groups/${group.id}`)}
      >
        {recent?.poster ? (
          <img
            src={recent.poster}
            alt={recent.title}
            className={styles.poster}
          />
        ) : (
          <div className={styles.posterFallback} />
        )}

        <div className={styles.info}>
          <div className={styles.nameRow}>
            <p className={styles.name}>{group.name}</p>
            {isOwner && <span className={styles.ownerBadge}>Owner</span>}
          </div>

          <div className={styles.stats}>
            <span className={styles.stat}>
              {filmCount} {filmCount === 1 ? "film" : "films"}
            </span>
            <span className={styles.statDot}>·</span>
            <span className={styles.stat}>
              {memberCount} {memberCount === 1 ? "member" : "members"}
            </span>
          </div>

          {recent && (
            <p className={styles.recentFilm}>
              {recent.title}
              {lastActivity && (
                <span className={styles.lastActivity}> · {lastActivity}</span>
              )}
            </p>
          )}
        </div>

        <svg
          className={styles.chevron}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* ── Actions ── */}
      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={() => onInvite(group)}>
          Invite Friend
        </button>
        {isOwner ? (
          <button className={styles.destructiveBtn} onClick={handleDeleteClick}>
            Delete
          </button>
        ) : (
          <button className={styles.destructiveBtn} onClick={handleLeaveClick}>
            Leave
          </button>
        )}
      </div>

      {/* ── Confirm Modal ── */}
      {showConfirm && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setShowConfirm(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <p className={styles.modalText}>
              {confirmType === "delete"
                ? `Delete "${group.name}"? This cannot be undone.`
                : `Leave "${group.name}"?`}
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancel}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button className={styles.modalConfirm} onClick={handleConfirm}>
                {confirmType === "delete" ? "Delete" : "Leave"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
