import { NavLink } from "react-router-dom";
import styles from "./HomePage.module.css";

export default function FriendsCard() {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Friends</h2>

      <div className={styles.cardRow}>
        <img
          src="/images/ticket.png"
          alt="Friends Icon"
          title="Friends"
          className={styles.cardIcon}
        />
        <p className={styles.cardContent}>
          Add friends to share your group watchlists.
        </p>
      </div>

      <NavLink to="/friends" className={styles.cardBtn}>
        Add Friends
      </NavLink>
    </div>
  );
}
