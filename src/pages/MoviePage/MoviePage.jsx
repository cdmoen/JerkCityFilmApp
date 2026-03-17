import {
  youtubeTrailer,
  director,
  topThreeStars,
} from "../../modules/movieDatabaseHelpers";
import { fetchMovieDetails } from "../../modules/fetchers";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useWatchlist } from "../../hooks/useWatchlist";
import styles from "./MoviePage.module.css";

export default function MoviePage() {
  const { user } = useAuth();
  const { movieID } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const { watchlist, addFilm } = useWatchlist(user?.uid);

  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMovieDetails(movieID);
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
  }, [movieID]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!movie) return <div className={styles.error}>Movie not found.</div>;

  const direc = director(movie);
  const stars = topThreeStars(movie);
  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`
    : "/images/backdrop_placeholder.svg";
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342/${movie.poster_path}`
    : "/images/placeholder.svg";
  const year = movie.release_date?.slice(0, 4);
  const youtubeCode = youtubeTrailer(movie);
  const isInWatchlist = watchlist.some((f) => f.id == String(movieID));
  const filmForWatchlist = {
    id: movieID,
    title: movie.title,
    poster,
    backdrop,
    year,
  };

  return (
    <div className={styles.page}>
      {/* hero */}
      <div className={styles.hero}>
        <img src={backdrop} alt={movie.title} className={styles.backdrop} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div className={styles.heroBottom}>
            <img src={poster} alt={movie.title} className={styles.poster} />
            <div className={styles.heroMeta}>
              <h1 className={styles.title}>{movie.title}</h1>
              <p className={styles.subtitle}>
                {year} &nbsp;·&nbsp;
                {movie.genres?.map((g) => g.name).join(", ")}
                &nbsp;·&nbsp; {movie.runtime} min
              </p>
              <div className={styles.heroActions}>
                <button
                  className={styles.trailerBtn}
                  onClick={() => setTrailerOpen(true)}
                >
                  ▶ Trailer
                </button>
                {user &&
                  (isInWatchlist ? (
                    <span className={styles.addedBadge}>✓ In Watchlist</span>
                  ) : (
                    <button
                      className={styles.watchlistBtn}
                      onClick={() => addFilm(filmForWatchlist)}
                    >
                      + Watchlist
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* info */}
      <div className={styles.body}>
        <p className={styles.overview}>{movie.overview}</p>

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Director</span>
            <span className={styles.detailValue}>{direc}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Starring</span>
            <span className={styles.detailValue}>{stars}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Runtime</span>
            <span className={styles.detailValue}>{movie.runtime} min</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Released</span>
            <span className={styles.detailValue}>{movie.release_date}</span>
          </div>
        </div>
      </div>

      {/* trailer modal */}
      {trailerOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setTrailerOpen(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalClose}
              onClick={() => setTrailerOpen(false)}
            >
              ✕
            </button>
            <iframe
              className={styles.iframe}
              src={
                youtubeCode
                  ? `https://www.youtube.com/embed/${youtubeCode}?autoplay=1`
                  : "https://www.youtube.com/embed/Aq5WXmQQooo"
              }
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
