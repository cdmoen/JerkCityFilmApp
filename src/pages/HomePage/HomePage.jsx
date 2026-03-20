import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useWatchlist } from "../../hooks/useWatchlist";
import { useAddButton } from "../../contexts/AddButtonContext";
import AddToWatchlistSheet from "./AddToWatchlistSheet";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { watchlist, addFilm, removeFilm } = useWatchlist(user?.uid);
  const [addFilmSheetIsOpen, setAddFilmSheetIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const pressTimer = useRef(null);
  const { setAction } = useAddButton();

  useEffect(() => {
    setAction(() => () => setAddFilmSheetIsOpen(true));
    return () => setAction(null); // clean up on unmount
  }, []);

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

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container} onClick={() => setEditMode(false)}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <h1 className={styles.logo}>JCFC</h1>
          <p className={styles.logoSub}>Jerk City Film Club</p>
        </div>

        <div className={styles.headerRight}>
          {editMode && (
            <button
              className={styles.doneBtn}
              onClick={(e) => {
                e.stopPropagation();
                setEditMode(false);
              }}
            >
              Done
            </button>
          )}

          <button className={styles.notificationBtn}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
        </div>
      </header>

      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>My Watchlist</h2>
        <span className={styles.sectionMeta}>{watchlist.length} films</span>
      </div>

      {/* Poster Grid */}
      {watchlist.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Nothing here yet.</p>
          <p className={styles.emptySub}>
            Tap the + button below to add your first film.
          </p>
        </div>
      ) : (
        <div className={styles.posterGrid}>
          {watchlist.map((film, index) => (
            <div
              key={film.id}
              className={`${styles.poster} ${editMode ? styles.posterEditMode : ""}`}
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
              <div className={styles.posterOverlay}>
                <h3 className={styles.posterTitle}>{film.title}</h3>
                <p className={styles.posterYear}>{film.year}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Film Sheet */}
      <AddToWatchlistSheet
        watchlist={watchlist}
        isOpen={addFilmSheetIsOpen}
        onClose={() => setAddFilmSheetIsOpen(false)}
        onAdd={(movie) => handleAddFilm(movie)}
      />
    </div>
  );
}
