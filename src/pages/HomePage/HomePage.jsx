import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import MyWatchlist from "./MyWatchlist";
import FriendsCard from "./FriendsCard";
import GroupsCard from "./GroupsCard";
import WatchlistCard from "./WatchlistCard";
import { useWatchlist } from "../../hooks/useWatchlist";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const { user, loading } = useAuth();
  const [showWatchlist, setShowWatchlist] = useState(false);
  const { watchlist, addFilm, removeFilm } = useWatchlist(user?.uid);

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <main className={styles.container}>
      {!showWatchlist && (
        <div className={styles.cardGrid}>
          <WatchlistCard onOpen={() => setShowWatchlist(true)} />
          <FriendsCard />
          <GroupsCard />
        </div>
      )}

      {showWatchlist && (
        <MyWatchlist
          watchlist={watchlist}
          addFilm={addFilm}
          removeFilm={removeFilm}
          onBack={() => setShowWatchlist(false)}
        />
      )}
    </main>
  );
}
