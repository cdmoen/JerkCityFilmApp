import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommentsSheet from "./CommentsSheet";
import RatingsSheet from "./RatingsSheet";
import SeenSheet from "./SeenSheet";
import {
  markFilmAsViewed,
  rateFilm,
} from "../../modules/groups/filmInteractions";
import { removeFilmFromGroup } from "../../modules/groups/removeFilmFromGroup";
import { useFriends } from "../../hooks/useFriends";
import styles from "./FilmCard.module.css";

export default function FilmCard({ film, filmId, groupId, uid, profile }) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [ratingsOpen, setRatingsOpen] = useState(false);
  const [seenOpen, setSeenOpen] = useState(false);
  const { friends } = useFriends(uid);
  const navigate = useNavigate();

  // Quick actions
  function handleViewed() {
    markFilmAsViewed(groupId, filmId, uid, profile);
    setSeenOpen(true); // optional: open sheet after marking
  }

  function handleQuickRating(rating) {
    rateFilm(groupId, filmId, uid, rating, profile);
    setRatingsOpen(true); // optional: open sheet after rating
  }

  function handleMovieClick(filmId) {
    navigate(`/movies/${filmId}`);
  }

  async function handleDelete() {
    await removeFilmFromGroup(groupId, filmId);
  }

  console.log(film);
  return (
    <div className={styles.card}>
      <img
        src={film.poster}
        className={styles.poster}
        onClick={() => handleMovieClick(filmId)}
      />

      <div className={styles.info}>
        <h3 className={styles.title} onClick={() => handleMovieClick(filmId)}>
          {film.title}
        </h3>

        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={() => setCommentsOpen(true)}
          >
            Comments
          </button>
          <button
            className={styles.actionBtn}
            onClick={() => setRatingsOpen(true)}
          >
            Ratings
          </button>
          <button
            className={styles.actionBtn}
            onClick={() => setSeenOpen(true)}
          >
            Viewed
          </button>
        </div>

        <div className={styles.quickActions}>
          <button className={styles.viewedBtn} onClick={handleViewed}>
            I've Viewed This
          </button>

          <div className={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={styles.ratingStar}
                onClick={() => handleQuickRating(n)}
              >
                {n}★
              </button>
            ))}
            <button className={styles.removeBtn} onClick={handleDelete}>
              Remove
            </button>
          </div>
        </div>
      </div>
      <CommentsSheet
        isOpen={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        groupId={groupId}
        filmId={filmId}
        uid={uid}
        profile={profile}
        friends={friends}
      />

      <RatingsSheet
        isOpen={ratingsOpen}
        onClose={() => setRatingsOpen(false)}
        groupId={groupId}
        filmId={filmId}
        profile={profile}
        friends={friends}
      />

      <SeenSheet
        isOpen={seenOpen}
        onClose={() => setSeenOpen(false)}
        groupId={groupId}
        filmId={filmId}
        profile={profile}
        friends={friends}
      />
    </div>
  );
}
