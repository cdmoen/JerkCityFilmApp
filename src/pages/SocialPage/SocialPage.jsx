import { useState, useEffect } from "react";
import { ref, onValue, get } from "firebase/database";
import { database } from "../../modules/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useFriends } from "../../hooks/useFriends";
import { useUserGroups } from "../../hooks/useUserGroups";
import { useIncomingInviteGroups } from "../../hooks/useIncomingInviteGroups";
import { acceptFriendRequest } from "../../modules/friends/acceptFriendRequest";
import { rejectFriendRequest } from "../../modules/friends/rejectFriendRequest";
import { acceptGroupInvite } from "../../modules/groups/acceptGroupInvite";
import { rejectGroupInvite } from "../../modules/groups/rejectGroupInvite";
import styles from "./SocialPage.module.css";

// Fetch activity for a single friend, returns array of activity events
async function fetchFriendActivity(friendUid) {
  const snap = await get(ref(database, `activity/${friendUid}`));
  if (!snap.exists()) return [];
  return Object.values(snap.val());
}

// Given a group object, return the most recently added film or null
function mostRecentFilm(group) {
  if (!group.films) return null;
  const films = Object.values(group.films);
  if (films.length === 0) return null;
  return films.sort((a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0))[0];
}

export default function SocialPage() {
  const { user } = useAuth();
  const uid = user?.uid;
  const navigate = useNavigate();

  // Friends and groups
  const { friends, loading: friendsLoading } = useFriends(uid);
  const { userGroups, loading: groupsLoading } = useUserGroups(uid);

  // Pending friend requests
  const [incomingFriendRequests, setIncomingFriendRequests] = useState({});

  // Pending group invites
  const [incomingGroupInvites, setIncomingGroupInvites] = useState({});
  const inviteGroups = useIncomingInviteGroups(incomingGroupInvites);

  // Friends activity feed
  const [activityFeed, setActivityFeed] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  // Subscribe to pending friend requests
  useEffect(() => {
    if (!uid) return;
    return onValue(ref(database, `friendRequestsIncoming/${uid}`), (snap) =>
      setIncomingFriendRequests(snap.val() || {}),
    );
  }, [uid]);

  // Subscribe to pending group invites
  useEffect(() => {
    if (!uid) return;
    return onValue(ref(database, `groupInvitesIncoming/${uid}`), (snap) =>
      setIncomingGroupInvites(snap.val() || {}),
    );
  }, [uid]);

  // Fetch friends activity feed once friends are loaded
  useEffect(() => {
    if (friendsLoading) return;
    if (friends.length === 0) {
      setActivityFeed([]);
      setActivityLoading(false);
      return;
    }

    async function loadFeed() {
      setActivityLoading(true);
      try {
        const allActivity = await Promise.all(
          friends.map((f) => fetchFriendActivity(f.uid)),
        );
        const merged = allActivity
          .flat()
          .sort((a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0))
          .slice(0, 30); // cap at 30 events
        setActivityFeed(merged);
      } catch (err) {
        console.error("Failed to load activity feed", err);
      } finally {
        setActivityLoading(false);
      }
    }

    loadFeed();
  }, [friends, friendsLoading]);

  const pendingFriendRequestIds = Object.keys(incomingFriendRequests);
  const pendingGroupInviteEntries = Object.entries(incomingGroupInvites);
  const hasPendingActions =
    pendingFriendRequestIds.length > 0 || pendingGroupInviteEntries.length > 0;

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.appBar}>
          <div>
            <div className={styles.logo}>JCFC</div>
            <div className={styles.logoSub}>Jerk City Film Club</div>
          </div>
        </div>
        <h1 className={styles.pageTitle}>Social</h1>
      </header>

      <div className={styles.body}>
        {/* ── Pending Actions ── */}
        {hasPendingActions && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Needs Your Attention</h2>
            <div className={styles.pendingList}>
              {pendingFriendRequestIds.map((requesterUid) => (
                <div key={requesterUid} className={styles.pendingCard}>
                  <div className={styles.pendingInfo}>
                    <p className={styles.pendingLabel}>Friend Request</p>
                    <p className={styles.pendingName}>
                      {friends.find((f) => f.uid === requesterUid)?.username ??
                        incomingFriendRequests[requesterUid]?.username ??
                        "Someone"}
                    </p>
                  </div>
                  <div className={styles.pendingActions}>
                    <button
                      className={styles.acceptBtn}
                      onClick={() => acceptFriendRequest(uid, requesterUid)}
                    >
                      Accept
                    </button>
                    <button
                      className={styles.rejectBtn}
                      onClick={() => rejectFriendRequest(uid, requesterUid)}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}

              {pendingGroupInviteEntries.map(([groupId, inviteData]) => {
                const group = inviteGroups[groupId];
                return (
                  <div key={groupId} className={styles.pendingCard}>
                    <div className={styles.pendingInfo}>
                      <p className={styles.pendingLabel}>Group Invite</p>
                      <p className={styles.pendingName}>
                        {group?.name ?? "A group"}
                      </p>
                    </div>
                    <div className={styles.pendingActions}>
                      <button
                        className={styles.acceptBtn}
                        onClick={() => acceptGroupInvite(uid, groupId)}
                      >
                        Join
                      </button>
                      <button
                        className={styles.rejectBtn}
                        onClick={() => rejectGroupInvite(uid, groupId)}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Your Groups ── */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Your Groups</h2>
            <button
              className={styles.sectionLink}
              onClick={() => navigate("/groups")}
            >
              Manage
            </button>
          </div>

          {groupsLoading ? (
            <p className={styles.emptyText}>Loading...</p>
          ) : userGroups.length === 0 ? (
            <div className={styles.emptyCard}>
              <p className={styles.emptyText}>You're not in any groups yet.</p>
              <button
                className={styles.emptyAction}
                onClick={() => navigate("/groups")}
              >
                Create a group
              </button>
            </div>
          ) : (
            <div className={styles.groupsList}>
              {userGroups.map((group) => {
                const recent = mostRecentFilm(group);
                const filmCount = group.films
                  ? Object.keys(group.films).length
                  : 0;
                return (
                  <button
                    key={group.id}
                    className={styles.groupCard}
                    onClick={() => navigate(`/groups/${group.id}`)}
                  >
                    {recent?.poster ? (
                      <img
                        src={recent.poster}
                        alt={recent.title}
                        className={styles.groupPoster}
                      />
                    ) : (
                      <div className={styles.groupPosterFallback} />
                    )}
                    <div className={styles.groupInfo}>
                      <p className={styles.groupName}>{group.name}</p>
                      <p className={styles.groupMeta}>
                        {filmCount} {filmCount === 1 ? "film" : "films"}
                      </p>
                      {recent && (
                        <p className={styles.groupRecent}>
                          Latest: {recent.title}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Friends Activity Feed ── */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Friends Activity</h2>
            <button
              className={styles.sectionLink}
              onClick={() => navigate("/friends")}
            >
              Manage
            </button>
          </div>

          {friendsLoading || activityLoading ? (
            <p className={styles.emptyText}>Loading...</p>
          ) : friends.length === 0 ? (
            <div className={styles.emptyCard}>
              <p className={styles.emptyText}>
                Add friends to see what they're watching.
              </p>
              <button
                className={styles.emptyAction}
                onClick={() => navigate("/friends")}
              >
                Find friends
              </button>
            </div>
          ) : activityFeed.length === 0 ? (
            <div className={styles.emptyCard}>
              <p className={styles.emptyText}>
                No recent activity from your friends.
              </p>
            </div>
          ) : (
            <div className={styles.feedList}>
              {activityFeed.map((event, idx) => (
                <button
                  key={`${event.filmId}-${idx}`}
                  className={styles.feedCard}
                  onClick={() => navigate(`/movies/${event.filmId}`)}
                >
                  {event.poster ? (
                    <img
                      src={event.poster}
                      alt={event.title}
                      className={styles.feedPoster}
                    />
                  ) : (
                    <div className={styles.feedPosterFallback} />
                  )}
                  <div className={styles.feedInfo}>
                    <p className={styles.feedTitle}>{event.title}</p>
                    <p className={styles.feedMeta}>
                      {event.year && (
                        <span className={styles.feedYear}>{event.year}</span>
                      )}
                    </p>
                    <p className={styles.feedUser}>
                      Added by{" "}
                      <span className={styles.feedUsername}>
                        {event.username ?? "a friend"}
                      </span>
                    </p>
                    <p className={styles.feedTime}>
                      {formatTimeAgo(event.addedAt)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return "";
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}
