import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AvatarPicker from "./AvatarPicker";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const { user, logout, profile, loading } = useAuth();
  const [pickerOpen, setPickerOpen] = useState(false);

  async function fetchBooks() {
    try {
      const response = await fetch(
        "https://jerkcityfilmapi.onrender.com/books",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.API_KEY,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <main className={styles.container}>
      <section
        className={styles.avatarSection}
        onClick={() => setPickerOpen(true)}
      >
        <div className={styles.avatarWrapper}>
          <div className={styles.avatarContainer}>
            <img
              src={profile?.avatarUrl}
              className={styles.avatarImage}
              alt="User avatar"
            />
          </div>
          <div className={styles.editBadge}>
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
              <path
                d="M11 2L14 5L5 14H2V11L11 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <span className={styles.changeLabel}>change avatar</span>
      </section>

      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <span className={styles.infoLabel}>username</span>
          <span className={styles.infoValue}>{profile?.username}</span>
        </div>
        <div className={styles.infoCard}>
          <span className={styles.infoLabel}>email</span>
          <span className={styles.infoValue}>{profile?.email}</span>
        </div>
      </div>

      {pickerOpen && (
        <AvatarPicker uid={user.uid} onClose={() => setPickerOpen(false)} />
      )}

      <button className={styles.logoutBtn} onClick={logout}>
        Logout
      </button>
      <button className={styles.logoutBtn} onClick={fetchBooks}>
        Fetch Books
      </button>
    </main>
  );
}
