import { useParams, useNavigate } from "react-router-dom";
import { useGroupFilms } from "../../hooks/useGroupFilms";
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../modules/firebase";
import { useAuth } from "../../contexts/AuthContext";
import AddFilmSheet from "./AddFilmSheet";
import FilmCard from "./FilmCard";
import styles from "./GroupPage.module.css";

export default function GroupPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const uid = user.uid;
  const { groupId } = useParams();
  const films = useGroupFilms(groupId);

  const [group, setGroup] = useState(null);
  const [addFilmSheetIsOpen, setAddFilmSheetIsOpen] = useState(false);

  function handleAddFilm() {
    setAddFilmSheetIsOpen(true);
  }

  useEffect(() => {
    const groupRef = ref(database, `groups/${groupId}`);
    return onValue(groupRef, (snap) => {
      if (snap.exists()) {
        setGroup(snap.val());
      }
    });
  }, [groupId]);

  if (!group) return <div>Loading group…</div>;

  return (
    <div className={styles.groupPage}>
      <header className={styles.groupHeader}>
        <button
          className={styles.backButton}
          onClick={() => navigate("/groups")}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="red"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <h1>{group.name}</h1>

        <button className={styles.addFilmBtn} onClick={handleAddFilm}>
          Add Film
        </button>
      </header>

      <div className={styles.filmList}>
        {films.map((film) => (
          <FilmCard
            key={film.id}
            film={film}
            filmId={film.id}
            groupId={groupId}
            uid={uid}
            profile={profile}
          />
        ))}
      </div>

      <AddFilmSheet
        groupId={groupId}
        uid={uid}
        onClose={() => setAddFilmSheetIsOpen(false)}
        isOpen={addFilmSheetIsOpen}
      />
    </div>
  );
}
