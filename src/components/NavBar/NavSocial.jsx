import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../modules/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink } from "react-router-dom";
import styles from "./NavSocial.module.css";

export default function NavSocial() {
  const { user } = useAuth();
  const [hasNotifications, setHasNotifications] = useState(false);

  useEffect(() => {
    if (!user) return;

    const friendRequestsRef = ref(
      database,
      `friendRequestsIncoming/${user.uid}`,
    );
    const groupInvitesRef = ref(database, `groupInvitesIncoming/${user.uid}`);

    let friendRequests = false;
    let groupInvites = false;

    const checkNotifications = () => {
      setHasNotifications(friendRequests || groupInvites);
    };

    const unsubFriendRequests = onValue(friendRequestsRef, (snap) => {
      const data = snap.val();
      friendRequests = data && Object.keys(data).length > 0;
      checkNotifications();
    });

    const unsubGroupInvites = onValue(groupInvitesRef, (snap) => {
      const data = snap.val();
      groupInvites = data && Object.keys(data).length > 0;
      checkNotifications();
    });

    return () => {
      unsubFriendRequests();
      unsubGroupInvites();
    };
  }, [user]);

  return (
    <NavLink
      to="/social"
      className={({ isActive }) =>
        `${styles.navItem} ${isActive ? styles.active : ""}`
      }
    >
      <div className={styles.iconContainer}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        {hasNotifications && <span className={styles.badge}></span>}
      </div>
      <span className={styles.navLabel}>Social</span>
    </NavLink>
  );
}
