import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useAddButton } from "../../contexts/AddButtonContext";
import NavSocial from "./NavSocial";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const { user } = useAuth();
  const { action } = useAddButton();

  if (!user) {
    return null; // Don't show nav when not logged in
  }

  return (
    <nav className={styles.navbar}>
      <NavLink
        to="/home"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }
      >
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
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
        <span className={styles.navLabel}>Watchlist</span>
      </NavLink>

      <NavSocial />

      {action && (
        <button className={styles.addButton} onClick={action}>
          <span className={styles.addButtonIcon}>+</span>
        </button>
      )}

      <NavLink
        to="/movies"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }
      >
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
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span className={styles.navLabel}>Search</span>
      </NavLink>

      <NavLink
        to="/account"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }
      >
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
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span className={styles.navLabel}>Account</span>
      </NavLink>
    </nav>
  );
}
