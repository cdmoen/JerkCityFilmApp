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
      [
        styles.friendsButton,
        hasRequests ? styles.pending : "",
        isActive ? styles.active : "",
      ]
        .filter(Boolean)
        .join(" ")
    }
    >
      <img
        src="/images/ticket.png"
        alt="Friend Icon"
        title="Friends"
        className={styles.friendIcon}
      />
      <span className={styles.linkText}>Friends</span>

      {hasRequests && <span className={styles.badge}></span>}
    </NavLink>
  );
}
