import { useParams, useNavigate } from "react-router-dom";
import { useGroupFilms } from "../../hooks/useGroupFilms";
import { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { database } from "../../modules/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useFriends } from "../../hooks/useFriends";
import { addFilmToGroup } from "../../modules/groups/addFilmToGroup";
import { removeFilmFromGroup } from "../../modules/groups/removeFilmFromGroup";
import {
  markFilmAsViewed,
  rateFilm,
} from "../../modules/groups/filmInteractions";
import { useAddButton } from "../../contexts/AddButtonContext";
import AddFilmToGroupSheet from "./AddFilmToGroupSheet";
import FilmCard from "./FilmCard";
import CommentsSheet from "./CommentsSheet";
import RatingsSheet from "./RatingsSheet";
import SeenSheet from "./SeenSheet";
import styles from "./GroupPage.module.css";

export default function GroupPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const uid = user?.uid;
  const { groupId } = useParams();
  const films = useGroupFilms(groupId);
  const { friends } = useFriends(uid);

  const [group, setGroup] = useState(null);
  const [addFilmSheetOpen, setAddFilmSheetOpen] = useState(false);

  // Lifted sheet state — one active film at a time
  const [activeFilm, setActiveFilm] = useState(null);
  const [activeSheet, setActiveSheet] = useState(null); // 'comments' | 'ratings' | 'seen'

  const { setAction } = useAddButton();

  useEffect(() => {
    setAction(() => () => setAddFilmSheetOpen(true));
    return () => setAction(null); // clean up on unmount
  }, []);

  function openSheet(film, sheet) {
    setActiveFilm(film);
    setActiveSheet(sheet);
  }

  function closeSheet() {
    setActiveSheet(null);
    setActiveFilm(null);
  }

  useEffect(() => {
    const groupRef = ref(database, `groups/${groupId}`);
    return onValue(groupRef, (snap) => {
      if (snap.exists()) setGroup(snap.val());
    });
  }, [groupId]);

  if (!group) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loading}>Loading...</p>
      </div>
    );
  }

  const memberCount = group.members ? Object.keys(group.members).length : 0;

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate("/groups")}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className={styles.headerCenter}>
          <h1 className={styles.groupName}>{group.name}</h1>
          <p className={styles.groupMeta}>
            {memberCount} {memberCount === 1 ? "member" : "members"}
            {films.length > 0 && (
              <>
                <span className={styles.separator}>·</span>
                {films.length} {films.length === 1 ? "film" : "films"}
              </>
            )}
          </p>
        </div>

        <button
          className={styles.addFilmBtn}
          onClick={() => setAddFilmSheetOpen(true)}
        >
          + Film
        </button>
      </header>

      {/* ── Film List ── */}
      <div className={styles.body}>
        {films.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No films added yet.</p>
            <button
              className={styles.emptyAction}
              onClick={() => setAddFilmSheetOpen(true)}
            >
              Add the first film
            </button>
          </div>
        ) : (
          <div className={styles.filmList}>
            {films.map((film) => (
              <FilmCard
                key={film.id}
                film={film}
                filmId={film.id}
                groupId={groupId}
                uid={uid}
                profile={profile}
                onOpenSheet={(sheet) => openSheet(film, sheet)}
                onMarkViewed={() =>
                  markFilmAsViewed(groupId, film.id, uid, profile)
                }
                onRate={(rating) =>
                  rateFilm(groupId, film.id, uid, rating, profile)
                }
                onRemove={() => removeFilmFromGroup(groupId, film.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Sheets — rendered once at page level ── */}
      <CommentsSheet
        isOpen={activeSheet === "comments"}
        onClose={closeSheet}
        groupId={groupId}
        film={activeFilm}
        uid={uid}
        profile={profile}
      />

      <RatingsSheet
        isOpen={activeSheet === "ratings"}
        onClose={closeSheet}
        groupId={groupId}
        film={activeFilm}
        friends={friends}
      />

      <SeenSheet
        isOpen={activeSheet === "seen"}
        onClose={closeSheet}
        groupId={groupId}
        film={activeFilm}
        friends={friends}
      />

      <AddFilmToGroupSheet
        isOpen={addFilmSheetOpen}
        onClose={() => setAddFilmSheetOpen(false)}
        onAdd={(movie) => addFilmToGroup(groupId, uid, movie.id)}
        groupFilms={films}
      />
    </div>
  );
}
