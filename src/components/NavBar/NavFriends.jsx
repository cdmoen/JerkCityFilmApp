import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../modules/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink } from "react-router-dom";
import styles from "./NavFriends.module.css";

export default function NavFriends() {
  const { user } = useAuth();
  const [hasRequests, setHasRequests] = useState(false);

  useEffect(() => {
    if (!user) return;

    const reqRef = ref(database, `friendRequestsIncoming/${user.uid}`);

    const unsubscribe = onValue(reqRef, (snap) => {
      const data = snap.val();
      setHasRequests(data && Object.keys(data).length > 0);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <NavLink
      to="/friends"
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
        {hasRequests && <span className={styles.badge}></span>}
      </div>
      <span className={styles.navLabel}>Friends</span>
    </NavLink>
  );
}
