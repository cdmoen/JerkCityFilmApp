import { NavLink } from "react-router-dom";
import styles from "./HomePage.module.css";

export default function GroupsCard() {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Groups</h2>

      <div className={styles.cardRow}>
        <img
          src="/images/roll.png"
          alt="Groups Icon"
          title="Groups"
          className={styles.cardIcon}
        />
        <p className={styles.cardContent}>
          Create a group to share watchlists.
        </p>
      </div>

      <NavLink to="/groups" className={styles.cardBtn}>
        Add Groups
      </NavLink>
    </div>
  );
}
