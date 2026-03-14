import { useState, useEffect, useMemo } from "react";
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

  // Data hooks
  const { userGroups, loading } = useUserGroups(uid);
  const { friends } = useFriends(uid);

  // Invite state
  const [incomingInvites, setIncomingInvites] = useState({});
  const [outgoingInvites, setOutgoingInvites] = useState({});

  const incomingInviteGroups = useIncomingInviteGroups(incomingInvites);

  // UI state
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Outgoing invites for selected group
  const invited = useGroupOutgoingInvites(uid, selectedGroupId);
  const filteredFriends = friends.filter((f) => !invited.includes(f.uid));

  // Subscriptions
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

  // Lookup maps
  const userGroupMap = useMemo(() => {
    const map = {};
    for (const g of userGroups) map[g.id] = g;
    return map;
  }, [userGroups]);

  const incomingGroupMap = useMemo(
    () => incomingInviteGroups,
    [incomingInviteGroups],
  );

  // Actions
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
      <h1 className={styles.title}>Your Groups</h1>

      <button
        onClick={() => setShowForm((prev) => !prev)}
        className={styles.createButton}
      >
        {showForm ? "Cancel" : "Create a New Group"}
      </button>

      {showForm && (
        <div className={styles.formWrapper}>
          <CreateGroup />
        </div>
      )}

      <h2 className={styles.sectionTitle}>Your Groups</h2>
      <UserGroupsList
        loading={loading}
        userGroups={userGroups}
        onDelete={handleDelete}
        onInvite={handleInvite}
      />

      <h2 className={styles.sectionTitle}>Group Invites</h2>
      <IncomingInvitesList
        incomingInvites={incomingInvites}
        incomingGroupMap={incomingGroupMap}
        friends={friends}
        uid={uid}
        acceptGroupInvite={acceptGroupInvite}
        rejectGroupInvite={rejectGroupInvite}
      />

      <h2 className={styles.sectionTitle}>Pending Invitations</h2>
      <OutgoingInvitesList
        outgoingInvites={outgoingInvites}
        userGroupMap={userGroupMap}
        friends={friends}
        uid={uid}
        cancelGroupInvite={cancelGroupInvite}
      />

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
