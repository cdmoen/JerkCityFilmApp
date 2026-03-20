import styles from "./OutgoingInvitesList.module.css";

export default function OutgoingInvitesList({
  outgoingInvites,
  userGroupMap,
  friends,
  uid,
  cancelGroupInvite,
}) {
  const entries = Object.entries(outgoingInvites);

  if (entries.length === 0) {
    return <p className={styles.empty}>No pending invitations.</p>;
  }

  return (
    <div className={styles.list}>
      {entries.flatMap(([groupId, invitedUsers]) => {
        const group = userGroupMap[groupId];
        const groupName = group?.name ?? groupId;

        return Object.keys(invitedUsers).map((friendUid) => {
          const friendName =
            friends.find((f) => f.uid === friendUid)?.username ?? friendUid;

          return (
            <div key={`${groupId}-${friendUid}`} className={styles.item}>
              <div className={styles.itemInfo}>
                <p className={styles.itemName}>{groupName}</p>
                <p className={styles.itemMeta}>Invited {friendName}</p>
              </div>
              <button
                className={styles.cancelBtn}
                onClick={() => cancelGroupInvite(uid, groupId, friendUid)}
              >
                Cancel
              </button>
            </div>
          );
        });
      })}
    </div>
  );
}
