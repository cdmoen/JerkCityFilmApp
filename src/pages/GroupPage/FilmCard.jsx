import { useNavigate } from "react-router-dom";
import styles from "./FilmCard.module.css";

export default function FilmCard({
  film,
  filmId,
  groupId,
  uid,
  profile,
  onOpenSheet,
  onMarkViewed,
  onRate,
  onRemove,
}) {
  const navigate = useNavigate();

  const hasViewed = film.seen?.[uid];
  const userRating = film.ratings?.[uid]?.rating ?? null;
  const seenCount = film.seen ? Object.keys(film.seen).length : 0;
  const ratingCount = film.ratings ? Object.keys(film.ratings).length : 0;
  const avgRating = ratingCount
    ? (
        Object.values(film.ratings).reduce((sum, v) => sum + v.rating, 0) /
        ratingCount
      ).toFixed(1)
    : null;

  return (
    <div className={styles.card}>

      {/* ── Poster ── */}
      <button
        className={styles.posterBtn}
        onClick={() => navigate(`/movies/${filmId}`)}
      >
        {film.poster ? (
          <img src={film.poster} alt={film.title} className={styles.poster} />
        ) : (
          <div className={styles.posterFallback} />
        )}
      </button>

      {/* ── Info ── */}
      <div className={styles.info}>

        <button
          className={styles.titleBtn}
          onClick={() => navigate(`/movies/${filmId}`)}
        >
          {film.title}
        </button>

        <p className={styles.meta}>
          {film.releaseDate?.slice(0, 4)}
          {film.director && (
            <>
              <span className={styles.dot}>·</span>
              {film.director}
            </>
          )}
        </p>

        {/* Stats row */}
        <div className={styles.stats}>
          {avgRating && (
            <span className={styles.stat}>★ {avgRating}</span>
          )}
          {seenCount > 0 && (
            <span className={styles.stat}>
              {seenCount} seen
            </span>
          )}
        </div>

        {/* Sheet triggers */}
        <div className={styles.sheetBtns}>
          <button
            className={styles.sheetBtn}
            onClick={() => onOpenSheet("comments")}
          >
            Comments
          </button>
          <button
            className={styles.sheetBtn}
            onClick={() => onOpenSheet("ratings")}
          >
            Ratings
            {ratingCount > 0 && (
              <span className={styles.sheetBtnCount}>{ratingCount}</span>
            )}
          </button>
          <button
            className={styles.sheetBtn}
            onClick={() => onOpenSheet("seen")}
          >
            Seen
            {seenCount > 0 && (
              <span className={styles.sheetBtnCount}>{seenCount}</span>
            )}
          </button>
        </div>

        {/* Quick actions */}
        <div className={styles.quickActions}>
          <button
            className={hasViewed ? styles.viewedActive : styles.viewedBtn}
            onClick={onMarkViewed}
            disabled={hasViewed}
          >
            {hasViewed ? "✓ Seen" : "Mark as seen"}
          </button>

          <div className={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={n <= userRating ? styles.starActive : styles.star}
                onClick={() => onRate(n)}
              >
                ★
              </button>
            ))}
          </div>

          <button className={styles.removeBtn} onClick={onRemove}>
            Remove
          </button>
        </div>

      </div>
    </div>
  );
}
