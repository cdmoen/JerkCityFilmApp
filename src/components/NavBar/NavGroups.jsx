import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../modules/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink } from "react-router-dom";
import styles from "./NavGroups.module.css";

export default function NavGroups() {
  const { user } = useAuth();
  const [hasInvites, setHasInvites] = useState(false);

  useEffect(() => {
    if (!user) return;

    const inviteRef = ref(database, `groupInvitesIncoming/${user.uid}`);

    const unsubscribe = onValue(inviteRef, (snap) => {
      const data = snap.val();
      setHasInvites(data && Object.keys(data).length > 0);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <NavLink
      to="/groups"
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
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        {hasInvites && <span className={styles.badge}></span>}
      </div>
      <span className={styles.navLabel}>Groups</span>
    </NavLink>
  );
}
