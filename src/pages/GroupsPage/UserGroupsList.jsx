import GroupCard from "./GroupCard";
import styles from "./UserGroupsList.module.css";

export default function UserGroupsList({
  loading,
  userGroups,
  onDelete,
  onInvite,
}) {
  if (loading) return <p>Loading groups...</p>;

  if (userGroups.length === 0)
    return <p className={styles.empty}>You don't belong to any groups yet.</p>;

  return (
    <>
      {userGroups.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          onDelete={onDelete}
          onInvite={onInvite}
        />
      ))}
    </>
  );
}
