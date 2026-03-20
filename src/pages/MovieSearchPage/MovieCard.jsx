import { youtubeTrailer } from "../../modules/movieDatabaseHelpers";
import { director } from "../../modules/movieDatabaseHelpers";
import { fetchMovieDetails } from "../../modules/fetchers";
import { topThreeStars } from "../../modules/movieDatabaseHelpers";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MovieCard.module.css";

export default function MovieCard({
  user,
  movieID,
  watchlist,
  addFilm,
  onTrailerClick,
}) {
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  function handleMovieClick(movieID) {
    navigate(`/movies/${movieID}`);
  }

  useEffect(() => {
    async function loadMovie() {
      setLoading(true);
      try {
        const data = await fetchMovieDetails(movieID);
        setMovie(data);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadMovie();
  }, [movieID]);

  if (loading) {
    return (
      <div className={styles.card}>
        <div className={styles.loadingState}>
          <div className={styles.loadingPoster}></div>
          <div className={styles.loadingContent}>
            <div className={styles.loadingTitle}></div>
            <div className={styles.loadingMeta}></div>
            <div className={styles.loadingActions}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className={styles.card}>
        <div className={styles.errorState}>
          <p className={styles.errorText}>Failed to load film</p>
        </div>
      </div>
    );
  }
  const title = movie.title;
  const year = movie.release_date?.slice(0, 4) || "—";
  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w780/${movie.backdrop_path}`
    : "/images/backdrop_placeholder.svg";
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342/${movie.poster_path}`
    : "/images/placeholder.svg";
  const stars = topThreeStars(movie);
  const direct = director(movie);
  const youtubeCode = youtubeTrailer(movie);
  const filmForWatchlist = {
    id: movieID,
    title,
    poster: poster,
    backdrop: backdrop,
    year: year,
  };
  const isInWatchlist = watchlist.some((f) => f.id == String(movieID));

  return (
    <div className={styles.card}>
      <div
        className={styles.posterWrapper}
        onClick={() => handleMovieClick(movieID)}
      >
        <picture>
          <source media="(min-width: 768px)" srcSet={poster} />
          <img className={styles.poster} src={backdrop} alt={title} />
        </picture>
        <div className={styles.posterOverlay}>
          <svg
            className={styles.playIcon}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.year}>{year}</p>
          </div>

          <div className={styles.actions}>
            {youtubeCode && (
              <button
                className={styles.trailerButton}
                onClick={() => onTrailerClick(youtubeCode)}
                aria-label="Watch trailer"
              >
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
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Trailer
              </button>
            )}

            {user &&
              (isInWatchlist ? (
                <div className={styles.addedIndicator}>
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
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Added
                </div>
              ) : (
                <button
                  className={styles.addButton}
                  onClick={() => addFilm(filmForWatchlist)}
                >
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
              ))}
          </div>
        </div>

        <div className={styles.details}>
          {direct && (
            <p className={styles.detail}>
              <span className={styles.detailLabel}>Director</span>
              <span className={styles.detailValue}>{direct}</span>
            </p>
          )}
          {stars && (
            <p className={styles.detail}>
              <span className={styles.detailLabel}>Starring</span>
              <span className={styles.detailValue}>{stars}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
