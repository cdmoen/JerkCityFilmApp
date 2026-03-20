import styles from "./IncomingInvitesList.module.css";

export default function IncomingInvitesList({
  incomingInvites,
  incomingInviteGroups,
  friends,
  uid,
  acceptGroupInvite,
  rejectGroupInvite,
}) {
  const entries = Object.entries(incomingInvites);

  if (entries.length === 0) {
    return <p className={styles.empty}>No pending group invites.</p>;
  }

  return (
    <div className={styles.list}>
      {entries.map(([groupId, invite]) => {
        const group = incomingInviteGroups[groupId];
        const groupName = group?.name ?? "A group";
        const inviter =
          friends.find((f) => f.uid === invite.from)?.username ?? "Someone";

        return (
          <div key={groupId} className={styles.item}>
            <div className={styles.itemInfo}>
              <p className={styles.itemName}>{groupName}</p>
              <p className={styles.itemMeta}>Invited by {inviter}</p>
            </div>
            <div className={styles.itemActions}>
              <button
                className={styles.acceptBtn}
                onClick={() => acceptGroupInvite(uid, groupId)}
              >
                Join
              </button>
              <button
                className={styles.rejectBtn}
                onClick={() => rejectGroupInvite(uid, groupId)}
              >
                Decline
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
