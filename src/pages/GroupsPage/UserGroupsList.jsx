import GroupCard from "./GroupCard";
import styles from "./UserGroupsList.module.css";

export default function UserGroupsList({
  loading,
  userGroups,
  uid,
  onDelete,
  onLeave,
  onInvite,
}) {
  if (loading) {
    return <p className={styles.empty}>Loading groups...</p>;
  }

  if (userGroups.length === 0) {
    return <p className={styles.empty}>You don't belong to any groups yet.</p>;
  }

  return (
    <div className={styles.list}>
      {userGroups.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          uid={uid}
          onDelete={onDelete}
          onLeave={onLeave}
          onInvite={onInvite}
        />
      ))}
    </div>
  );
}
