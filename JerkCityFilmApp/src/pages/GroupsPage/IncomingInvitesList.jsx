import styles from "./IncomingInvitesList.module.css";

export default function IncomingInvitesList({
  incomingInvites,
  incomingGroupMap,
  friends,
  uid,
  acceptGroupInvite,
  rejectGroupInvite,
}) {
  if (Object.keys(incomingInvites).length === 0)
    return <p className={styles.empty}>No group invites.</p>;

  return (
    <ul className={styles.list}>
      {Object.entries(incomingInvites).map(([inviteId, invite]) => {
        const groupId = invite.groupId;
        const group = incomingGroupMap[groupId];
        const groupName = group?.name || groupId;

        const inviter =
          friends.find((f) => f.uid === invite.from)?.username || invite.from;

        return (
          <li key={inviteId} className={styles.listItem}>
            <span className={styles.groupName}>
              {inviter} has invited you to join: {groupName}
            </span>

            <div className={styles.buttonRow}>
              <button
                className={styles.acceptButton}
                onClick={() => acceptGroupInvite(uid, groupId)}
              >
                Accept
              </button>
              <button
                className={styles.rejectButton}
                onClick={() => rejectGroupInvite(uid, groupId)}
              >
                Reject
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
