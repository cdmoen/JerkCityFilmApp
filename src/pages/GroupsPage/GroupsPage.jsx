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
import { leaveGroup } from "../../modules/groups/leaveGroup";
import UserGroupsList from "./UserGroupsList";
import IncomingInvitesList from "./IncomingInvitesList";
import OutgoingInvitesList from "./OutgoingInvitesList";
import CreateGroup from "./CreateGroup";
import FriendPickerSheet from "./FriendPickerSheet";
import styles from "./GroupsPage.module.css";

// Sort helpers
function mostRecentActivity(group) {
  if (!group.films) return 0;
  const films = Object.values(group.films);
  if (films.length === 0) return 0;
  return Math.max(...films.map((f) => f.addedAt ?? 0));
}

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
  const [sortOrder, setSortOrder] = useState("recent"); // 'recent' | 'az'
  const invited = useGroupOutgoingInvites(uid, selectedGroupId);
  const filteredFriends = friends.filter((f) => !invited.includes(f.uid));

  const incomingCount = Object.keys(incomingInvites).length;
  const outgoingCount = Object.entries(outgoingInvites).reduce(
    (acc, [, users]) => acc + Object.keys(users).length,
    0,
  );

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

  const sortedGroups = [...userGroups].sort((a, b) => {
    if (sortOrder === "az") return a.name.localeCompare(b.name);
    return mostRecentActivity(b) - mostRecentActivity(a);
  });

  function handleDelete(group) {
    deleteGroup(group.id, uid);
  }

  function handleLeave(group) {
    leaveGroup(uid, group.id);
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
    <div className={styles.page}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Groups</h1>
        <button
          className={showForm ? styles.cancelBtn : styles.createBtn}
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Cancel" : "+ New Group"}
        </button>
      </header>

      <div className={styles.body}>
        {/* ── Create Form ── */}
        {showForm && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>New Group</h2>
            <CreateGroup onCreated={() => setShowForm(false)} />
          </div>
        )}

        {/* ── Your Groups ── */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Your Groups
              {userGroups.length > 0 && (
                <span className={styles.count}>{userGroups.length}</span>
              )}
            </h2>
            {userGroups.length > 1 && (
              <div className={styles.sortToggle}>
                <button
                  className={
                    sortOrder === "recent" ? styles.sortActive : styles.sortBtn
                  }
                  onClick={() => setSortOrder("recent")}
                >
                  Recent
                </button>
                <button
                  className={
                    sortOrder === "az" ? styles.sortActive : styles.sortBtn
                  }
                  onClick={() => setSortOrder("az")}
                >
                  A–Z
                </button>
              </div>
            )}
          </div>
          <UserGroupsList
            loading={loading}
            userGroups={sortedGroups}
            uid={uid}
            onDelete={handleDelete}
            onLeave={handleLeave}
            onInvite={handleInvite}
          />
        </div>

        {/* ── Invites (secondary) ── */}
        {(incomingCount > 0 || outgoingCount > 0) && (
          <div className={styles.invitesRow}>
            {incomingCount > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  Invites
                  <span className={styles.count}>{incomingCount}</span>
                </h2>
                <IncomingInvitesList
                  incomingInvites={incomingInvites}
                  incomingInviteGroups={incomingInviteGroups}
                  friends={friends}
                  uid={uid}
                  acceptGroupInvite={acceptGroupInvite}
                  rejectGroupInvite={rejectGroupInvite}
                />
              </div>
            )}
            {outgoingCount > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  Pending
                  <span className={styles.count}>{outgoingCount}</span>
                </h2>
                <OutgoingInvitesList
                  outgoingInvites={outgoingInvites}
                  userGroupMap={userGroupMap}
                  friends={friends}
                  uid={uid}
                  cancelGroupInvite={cancelGroupInvite}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <FriendPickerSheet
        isOpen={isPickerOpen}
        onClose={onClose}
        groupId={selectedGroupId}
        group={selectedGroup}
        uid={uid}
        filteredFriends={filteredFriends}
      />
    </div>
  );
}
