import { useEffect, useState } from "react";
import { ref, onValue, get } from "firebase/database";
import { database } from "../modules/firebase";

/**
 * useFriends(uid)
 *
 * Loads the user's friends list in two steps:
 * 1. Subscribes to friends/{uid} to get the list of friend UIDs.
 * 2. Fetches each friend's public profile from usersPublic/{friendUid}.
 *
 * Returns:
 * - friends: an ARRAY of friend objects like so: 
        [
          { uid, username, avatarUrl, ... }, 
          {uid, username, avatarUrl, ...}
        ]
 * 
 * 
 * - loading: a boolean
 *
 * This mirrors the structure of useUserGroups and keeps all friend-loading
 * logic in one place so components stay clean and focused.
 */
export function useFriends(uid) {
  // Holds the list of friend UIDs (from friends/{uid})
  const [friendIds, setFriendIds] = useState([]);

  // Holds the fully loaded friend objects (username, avatar, etc.)
  const [friends, setFriends] = useState([]);

  // Indicates whether the hook is still loading data
  const [loading, setLoading] = useState(true);

  /**
   * STEP 1 — Subscribe to the user's friend list
   *
   * friends/{uid} looks like:
   * {
   *   "friendUid1": true,
   *   "friendUid2": true
   * }
   *
   * We only need the keys.
   */
  useEffect(() => {
    if (!uid) return;

    const friendsRef = ref(database, `friends/${uid}`);

    const unsubscribe = onValue(friendsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setFriendIds(Object.keys(data));
    });

    return () => unsubscribe();
  }, [uid]);

  /**
   * STEP 2 — Fetch public profile info for each friend
   *
   * For each friend UID, we load:
   * usersPublic/{friendUid}
   *
   * A public profile might look like:
   * {
   *   username: "Colin",
   *   avatarUrl: "https://...",
   *   bio: "..."
   * }
   *
   * We normalize missing fields so the UI never crashes.
   */
  useEffect(() => {
    async function fetchFriends() {
      // If the user has no friends, clear and stop loading
      if (friendIds.length === 0) {
        setFriends([]);
        setLoading(false);
        return;
      }

      const results = [];

      for (const friendUid of friendIds) {
        const snap = await get(ref(database, `usersPublic/${friendUid}`));

        if (snap.exists()) {
          const profile = snap.val();

          // Normalize missing fields so UI always receives safe values
          results.push({
            uid: friendUid,
            username: profile.username || "Unknown User",
            avatarUrl: profile.avatarUrl || null,
            ...profile,
          });
        }
      }

      setFriends(results);
      setLoading(false);
    }

    fetchFriends();
  }, [friendIds]);

  return { friends, loading };
}
