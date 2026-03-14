import { inviteToGroup } from "../../modules/groups/inviteToGroup";
import { useGroupOutgoingInvites } from "../../hooks/useGroupOutgoingInvites";
import styles from "./FriendPickerSheet.module.css";

export default function FriendPickerSheet({
  isOpen,
  onClose,
  groupId,
  group,
  uid,
  filteredFriends = [],
}) {
  if (!isOpen) return null;

  async function handleInvite(friendUid) {
    try {
      await inviteToGroup(groupId, uid, friendUid);
      onClose();
    } catch (err) {
      console.error("Error sending invite:", err);
    }
  }

  // filteredFriends is an array of friends who haven't already been invited to the group.
  // friendsMinusGroupOwner also removes the creator of the group so that they
  // can't be invited to a group they themselves created.
  const friendsMinusGroupOwner = filteredFriends.filter(
    (friend) => friend.uid !== group.createdBy,
  );

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.sheet}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <div className={styles.header}>
          <div className={styles.dragHandle} />
          <h2>Invite Friends</h2>
        </div>

        <div className={styles.list}>
          {filteredFriends.length === 0 && (
            <p className={styles.empty}>You have no friends to invite.</p>
          )}

          {friendsMinusGroupOwner.map((friend) => (
            <div key={friend.uid} className={styles.friendRow}>
              <span className={styles.friendName}>{friend.username}</span>
              <button
                className={styles.inviteButton}
                onClick={() => handleInvite(friend.uid)}
              >
                Invite
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
