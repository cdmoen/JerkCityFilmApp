import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { useAuth } from "../../contexts/AuthContext";
import { database } from "../../modules/firebase";
import { useUserGroups } from "../../hooks/useUserGroups";
import { useIncomingInviteGroups } from "../../hooks/useIncomingInviteGroups";
import { useFriends } from "../../hooks/useFriends";
import { useGroupOutgoingInvites } from "../../hooks/useGroupOutgoingInvites";
import { cancelGroupInvite } from "../../modules/groups/cancelGroupInvite";
import { acceptGroupInvite } from "../../modules/groups/acceptGroupInvite";
import { rejectGroupInvite } from "../../modules/groups/rejectGroupInvite";
import { deleteGroup } from "../../modules/groups/deleteGroup";
import UserGroupsList from "./UserGroupsList";
import IncomingInvitesList from "./IncomingInvitesList";
import OutgoingInvitesList from "./OutgoingInvitesList";
import CreateGroup from "./CreateGroup";
import FriendPickerSheet from "./FriendPickerSheet";
import styles from "./GroupsPage.module.css";

export default function GroupsPage() {
  const { user } = useAuth();
  const uid = user?.uid;
  const { userGroups, loading } = useUserGroups(uid);
  const { friends } = useFriends(uid);
  const [incomingInvites, setIncomingInvites] = useState({});
  const [outgoingInvites, setOutgoingInvites] = useState({});
  const incomingInviteGroups = useIncomingInviteGroups(incomingInvites);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const invited = useGroupOutgoingInvites(uid, selectedGroupId);
  const filteredFriends = friends.filter((f) => !invited.includes(f.uid));

  useEffect(() => {
    if (!uid) return;

    const incomingRef = ref(database, `groupInvitesIncoming/${uid}`);
    const outgoingRef = ref(database, `groupInvitesOutgoing/${uid}`);

    const unsubIncoming = onValue(incomingRef, (snap) =>
      setIncomingInvites(snap.val() || {}),
    );
    const unsubOutgoing = onValue(outgoingRef, (snap) =>
      setOutgoingInvites(snap.val() || {}),
    );

    return () => {
      unsubIncoming();
      unsubOutgoing();
    };
  }, [uid]);

  const userGroupMap = {};
  for (const g of userGroups) {
    userGroupMap[g.id] = g;
  }

  function handleDelete(group) {
    deleteGroup(group.id, uid);
  }

  function handleInvite(group) {
    setSelectedGroupId(group.id);
    setSelectedGroup(group);
    setIsPickerOpen(true);
  }

  function onClose() {
    setIsPickerOpen(false);
    setSelectedGroupId(null);
  }

  return (
    <main className={styles.container}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Create a Group</h2>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className={showForm ? styles.cancelButton : styles.createButton}
          >
            {showForm ? "Cancel" : "Create a New Group"}
          </button>
        </div>

        {showForm && (
          <div className={styles.formWrapper}>
            <CreateGroup />
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Groups</h2>
        <UserGroupsList
          loading={loading}
          userGroups={userGroups}
          onDelete={handleDelete}
          onInvite={handleInvite}
        />
      </div>

      <div className={styles.topRow}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Group Invites</h2>
          <IncomingInvitesList
            incomingInvites={incomingInvites}
            incomingInviteGroups={incomingInviteGroups}
            friends={friends}
            uid={uid}
            acceptGroupInvite={acceptGroupInvite}
            rejectGroupInvite={rejectGroupInvite}
          />
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Pending Invitations</h2>
          <OutgoingInvitesList
            outgoingInvites={outgoingInvites}
            userGroupMap={userGroupMap}
            friends={friends}
            uid={uid}
            cancelGroupInvite={cancelGroupInvite}
          />
        </div>
      </div>

      <FriendPickerSheet
        isOpen={isPickerOpen}
        onClose={onClose}
        groupId={selectedGroupId}
        group={selectedGroup}
        uid={uid}
        filteredFriends={filteredFriends}
      />
    </main>
  );
}
