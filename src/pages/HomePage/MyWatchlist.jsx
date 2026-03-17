import { useState, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import AddFilmSheet from "../../components/AddFilmSheet/AddFilmSheet";
import styles from "./MyWatchlist.module.css";

export default function MyWatchlist({
  watchlist,
  addFilm,
  removeFilm,
  onBack,
}) {
  const [addFilmSheetIsOpen, setAddFilmSheetIsOpen] = useState(false);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const pressTimer = useRef(null);

  function handleTouchStart() {
    pressTimer.current = setTimeout(() => setEditMode(true), 500);
  }

  function handleTouchEnd() {
    clearTimeout(pressTimer.current);
  }

  function handleCardClick(e, filmId) {
    e.stopPropagation();
    if (editMode) return;
    navigate(`/movies/${filmId}`);
  }

  function handleRemove(e, filmId) {
    e.stopPropagation();
    removeFilm(filmId);
  }

  function handleAddFilm(movie) {
    addFilm({
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
        : "/images/placeholder.svg",
      backdrop: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
        : "/images/backdrop_placeholder.svg",
      year: movie.release_date?.slice(0, 4),
    });
    setAddFilmSheetIsOpen(false);
  }

  return (
    <div className={styles.root} onClick={() => setEditMode(false)}>
      <div className={styles.hero}>
        <div className={styles.topRow}>
          <button className={styles.back} onClick={onBack}>
            ← Back
          </button>
          <div className={styles.topRowRight}>
            {editMode && (
              <button
                className={styles.doneBtn}
                onClick={() => setEditMode(false)}
              >
                Done
              </button>
            )}
            <button
              className={styles.addBtn}
              onClick={() => setAddFilmSheetIsOpen(true)}
            >
              + Add Film
            </button>
          </div>
        </div>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>Your collection</p>
          <h1 className={styles.title}>
            My <span>Watchlist</span>
          </h1>
          <p className={styles.meta}>
            {watchlist.length} film{watchlist.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <AddFilmSheet
        isOpen={addFilmSheetIsOpen}
        onClose={() => setAddFilmSheetIsOpen(false)}
        onAdd={(movie) => handleAddFilm(movie)}
      />
      {watchlist.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Nothing here yet.</p>
          <p className={styles.emptySub}>
            Add a film to start your collection.
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {watchlist.map((film, index) => (
            <div
              key={film.id}
              className={`${styles.card} ${editMode ? styles.cardEditMode : ""}`}
              style={{ animationDelay: `${index * 0.04}s` }}
              onClick={(e) => handleCardClick(e, film.id)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <button
                className={styles.removeBadge}
                onClick={(e) => handleRemove(e, film.id)}
              >
                ×
              </button>
              <img
                src={film.poster}
                alt={film.title}
                className={styles.poster}
              />
              <div className={styles.overlay}>
                <p className={styles.cardTitle}>{film.title}</p>
                <p className={styles.cardYear}>{film.releaseDate}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
