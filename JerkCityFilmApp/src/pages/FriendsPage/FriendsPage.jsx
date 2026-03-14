import { useState, useEffect } from "react";
import { ref, onValue, get } from "firebase/database";
import { useAuth } from "../../contexts/AuthContext";
import { database } from "../../modules/firebase";
import SearchUsers from "./SearchUsers";
import { sendFriendRequest } from "../../modules/friends/sendFriendRequest";
import { acceptFriendRequest } from "../../modules/friends/acceptFriendRequest";
import { rejectFriendRequest } from "../../modules/friends/rejectFriendRequest";
import { cancelFriendRequest } from "../../modules/friends/cancelFriendRequest";
import { deleteFriend } from "../../modules/friends/deleteFriend";
import styles from "./FriendsPage.module.css";

export default function FriendsPage() {
  const { user, logout } = useAuth();
  const uid = user?.uid;

  const [friends, setFriends] = useState({});
  const [incoming, setIncoming] = useState({});
  const [outgoing, setOutgoing] = useState({});

  // ---- USERNAME CACHE ----
  const [usernames, setUsernames] = useState({});

  async function getUsername(otherUid) {
    if (!otherUid) return "(unknown)";
    if (usernames[otherUid]) return usernames[otherUid];

    const snap = await get(ref(database, `usersPublic/${otherUid}`));
    const username = snap.exists() ? snap.val().username : "(unknown)";

    setUsernames((prev) => ({ ...prev, [otherUid]: username }));
    return username;
  }

  useEffect(() => {
    Object.keys(friends).forEach(getUsername);
    Object.keys(incoming).forEach(getUsername);
    Object.keys(outgoing).forEach(getUsername);
  }, [friends, incoming, outgoing]);

  // ---- SUBSCRIPTIONS ----
  useEffect(() => {
    if (!uid) return;

    const unsubFriends = onValue(ref(database, `friends/${uid}`), (snap) =>
      setFriends(snap.val() || {}),
    );

    const unsubIncoming = onValue(
      ref(database, `friendRequestsIncoming/${uid}`),
      (snap) => setIncoming(snap.val() || {}),
    );

    const unsubOutgoing = onValue(
      ref(database, `friendRequestsOutgoing/${uid}`),
      (snap) => setOutgoing(snap.val() || {}),
    );

    return () => {
      unsubFriends();
      unsubIncoming();
      unsubOutgoing();
    };
  }, [uid]);

  return (
    <div className={styles.container}>
      <h1>Friends</h1>
      <h2 className={styles.sectionTitle}>Add Friends</h2>
      <SearchUsers
        friends={friends}
        incoming={incoming}
        outgoing={outgoing}
        onSendRequest={(otherUid) => sendFriendRequest(uid, otherUid)}
      />

      {/* FRIEND LIST */}
      <h2 className={styles.sectionTitle}>Your Friends</h2>
      {Object.keys(friends).length === 0 ? (
        <p className={styles.empty}>No friends yet.</p>
      ) : (
        <ul className={styles.list}>
          {Object.keys(friends).map((friendUid) => (
            <li key={friendUid} className={styles.listItem}>
              <span className={styles.username}>
                {usernames[friendUid] || "Loading..."}
              </span>
              <button
                className={styles.rejectButton}
                onClick={() => deleteFriend(uid, friendUid)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* INCOMING REQUESTS */}
      <h2 className={styles.sectionTitle}>Incoming Friend Requests</h2>
      {Object.keys(incoming).length === 0 ? (
        <p className={styles.empty}>No incoming requests.</p>
      ) : (
        <ul className={styles.list}>
          {Object.keys(incoming).map((otherUid) => (
            <li key={otherUid} className={styles.listItem}>
              <span className={styles.username}>
                {usernames[otherUid] || "Loading..."}
              </span>

              <div className={styles.buttonRow}>
                <button
                  className={styles.acceptButton}
                  onClick={() => acceptFriendRequest(uid, otherUid)}
                >
                  Accept
                </button>
                <button
                  className={styles.rejectButton}
                  onClick={() => rejectFriendRequest(uid, otherUid)}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* OUTGOING REQUESTS */}
      <h2 className={styles.sectionTitle}>Outgoing Friend Requests</h2>
      {Object.keys(outgoing).length === 0 ? (
        <p className={styles.empty}>No outgoing requests.</p>
      ) : (
        <ul className={styles.list}>
          {Object.keys(outgoing).map((otherUid) => (
            <li key={otherUid} className={styles.listItem}>
              <span className={styles.username}>
                {usernames[otherUid] || "Loading..."}
              </span>

              <button
                className={styles.rejectButton}
                onClick={() => cancelFriendRequest(uid, otherUid)}
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      )}

      <button className={styles.logoutButton} onClick={logout}>
        Logout
      </button>
    </div>
  );
}
