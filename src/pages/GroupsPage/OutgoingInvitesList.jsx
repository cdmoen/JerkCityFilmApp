import styles from "./OutgoingInvitesList.module.css";

export default function OutgoingInvitesList({
  outgoingInvites,
  userGroupMap,
  friends,
  uid,
  cancelGroupInvite,
}) {
  if (Object.keys(outgoingInvites).length === 0)
    return <p className={styles.empty}>No pending invites.</p>;

  return (
    <ul className={styles.list}>
      {Object.entries(outgoingInvites).map(([groupId, invitedUsers]) => {
        const group = userGroupMap[groupId];
        const groupName = group?.name || groupId;

        return Object.keys(invitedUsers).map((friendUid) => (
          <li key={`${groupId}-${friendUid}`} className={styles.listItem}>
            <span className={styles.groupName}>
              {groupName} ➡️ {friends.find((i) => i.uid === friendUid)?.username}
            </span>

            <button
              className={styles.rejectButton}
              onClick={() => cancelGroupInvite(uid, groupId, friendUid)}
            >
              Cancel
            </button>
          </li>
        ));
      })}
    </ul>
  );
}
