import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import NavFriends from "./NavFriends";
import NavGroups from "./NavGroups";
import styles from "./NavBar.module.css";
import { useTheme } from "../../contexts/ThemeContext.jsx";

export default function NavBar() {
  const { user, profile, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <nav className={styles.navbar}>
        <NavLink to="/home">
          <picture>
            <source
              media="(max-width: 390px)"
              srcSet="/images/logo-f-play.png"
            />
            <source
              media="(min-width: 391px)"
              srcSet="/images/logo-flickd-play.png"
            />
            <img
              src="/images/logo-f-play.png"
              alt="Logo"
              title="Flickd Home"
              className={styles.logo}
            />
          </picture>
        </NavLink>

        <NavFriends />

        <NavGroups />

        <NavLink
          to="/movies"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <img
            src="/images/search.png"
            alt="Search Icon"
            title="Search Movies"
            className={styles.searchIcon}
          />
          <span className={styles.linkText}>Search</span>
        </NavLink>

        <span className={styles.loginStatus}>
          Welcome, {profile?.username}!
        </span>

        <button className={styles.themeToggle} onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <span className={styles.logoutBtn} onClick={logout}>
          Logout
        </span>
      </nav>
    </>
  );
}
