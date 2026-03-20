import styles from "./FilmSearchResultsCard.module.css";

export default function FilmSearchResultsCard({ watchlist, movie, onAdd }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : "/images/placeholder.svg";

  const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : "—";
  const movieInWatchlist = watchlist.find((film) => film.id === movie.id);

  return (
    <div className={styles.card}>
      <div className={styles.posterContainer}>
        <img src={posterUrl} alt={movie.title} className={styles.poster} />
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{movie.title}</h3>
        <p className={styles.year}>{releaseYear}</p>
        {movie.overview && (
          <p className={styles.overview}>
            {movie.overview.length > 120
              ? `${movie.overview.slice(0, 120)}...`
              : movie.overview}
          </p>
        )}
      </div>

      <div className={styles.action}>
        {movieInWatchlist ? (
          <div className={styles.addedIndicator}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span className={styles.addedText}>Added</span>
          </div>
        ) : (
          <button className={styles.addButton} onClick={onAdd}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add
          </button>
        )}
      </div>
    </div>
  );
}
