import {
  youtubeTrailer,
  directorWithID,
  topThreeStars,
} from "../../modules/movieDatabaseHelpers";
import { fetchMovieDetails } from "../../modules/fetchers";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useWatchlist } from "../../hooks/useWatchlist";
import { useAddButton } from "../../contexts/AddButtonContext";
import styles from "./MoviePage.module.css";

const TMDB_AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNDRhMzU5M2M5M2ExYjA4M2Q2ZmNjYjE1Mzk1Zjc5ZCIsIm5iZiI6MTc3MTYxNDI2NS4wMjgsInN1YiI6IjY5OThiMDM5NDlkODE1ZDRiY2M5OWNjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-4R9PwE931m9oQjt5seK2Opvw6erzfZX47c7CPGYxgw";

async function fetchWatchProviders(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TMDB_AUTH_TOKEN}`,
    },
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data.results?.US ?? null;
}

async function fetchDirectorFilms(directorId) {
  const url = `https://api.themoviedb.org/3/person/${directorId}/movie_credits`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TMDB_AUTH_TOKEN}`,
    },
  });
  if (!response.ok) return [];
  const data = await response.json();
  return (data.crew ?? [])
    .filter((f) => f.job === "Director" && f.poster_path)
    .sort((a, b) => {
      if (!a.release_date) return 1;
      if (!b.release_date) return -1;
      return b.release_date.localeCompare(a.release_date);
    });
}

export default function MoviePage() {
  const { user } = useAuth();
  const { movieID } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [providers, setProviders] = useState(null);
  const [directorFilms, setDirectorFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const { watchlist, addFilm } = useWatchlist(user?.uid);
  const { setAction } = useAddButton();

  useEffect(() => {
    if (!movie) return;

    const filmForWatchlist = {
      id: movieID,
      title: movie.title,
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w342/${movie.poster_path}`
        : "/images/placeholder.svg",
      backdrop: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`
        : "/images/backdrop_placeholder.svg",
      year: movie.release_date?.slice(0, 4),
    };

    setAction(() => () => addFilm(filmForWatchlist));
    return () => setAction(null);
  }, [movie]);

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true);
        setError(null);
        setSynopsisExpanded(false);
        setDirectorFilms([]);

        const [movieData, providerData] = await Promise.all([
          fetchMovieDetails(movieID),
          fetchWatchProviders(movieID),
        ]);

        setMovie(movieData);
        setProviders(providerData);

        // Fetch director films after we have the movie data
        const direc = directorWithID(movieData);
        if (direc) {
          const films = await fetchDirectorFilms(direc.id);
          setDirectorFilms(
            films.filter((f) => String(f.id) !== String(movieID)),
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPage();
  }, [movieID]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>Error: {error}</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>Movie not found.</div>
      </div>
    );
  }

  const direc = directorWithID(movie);
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

  const SYNOPSIS_THRESHOLD = 180;
  const synopsisIsLong = movie.overview?.length > SYNOPSIS_THRESHOLD;
  const displayedSynopsis =
    synopsisIsLong && !synopsisExpanded
      ? movie.overview.slice(0, SYNOPSIS_THRESHOLD).trimEnd() + "…"
      : movie.overview;

  const streamingProviders = providers?.flatrate ?? [];
  const rentProviders = providers?.rent ?? [];
  const buyProviders = providers?.buy ?? [];
  const hasProviders =
    streamingProviders.length > 0 ||
    rentProviders.length > 0 ||
    buyProviders.length > 0;

  const similarFilms = movie.recommendations?.results?.slice(0, 12) ?? [];

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <div className={styles.hero}>
        <img src={backdrop} alt={movie.title} className={styles.backdrop} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
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

          <div className={styles.heroBottom}>
            <img src={poster} alt={movie.title} className={styles.poster} />
            <div className={styles.heroMeta}>
              <h1 className={styles.title}>{movie.title}</h1>
              <p className={styles.subtitle}>
                {year}
                {movie.runtime && (
                  <>
                    <span className={styles.separator}>·</span>
                    {movie.runtime} min
                  </>
                )}
                {movie.genres?.length > 0 && (
                  <>
                    <span className={styles.separator}>·</span>
                    {movie.genres.map((g) => g.name).join(", ")}
                  </>
                )}
              </p>
              {movie.vote_average > 0 && (
                <p className={styles.rating}>
                  ★ {movie.vote_average.toFixed(1)}
                  <span className={styles.ratingSource}>TMDB</span>
                </p>
              )}
              <div className={styles.heroActions}>
                {youtubeCode && (
                  <button
                    className={styles.trailerBtn}
                    onClick={() => setTrailerOpen(true)}
                  >
                    <svg
                      width="12"
                      height="12"
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
                    <span className={styles.addedBadge}>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      In Watchlist
                    </span>
                  ) : (
                    <button
                      className={styles.watchlistBtn}
                      onClick={() => addFilm(filmForWatchlist)}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Watchlist
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className={styles.body}>
        {/* Tagline */}
        {movie.tagline && <p className={styles.tagline}>"{movie.tagline}"</p>}

        {/* Synopsis */}
        {movie.overview && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Synopsis</h2>
            <p className={styles.overview}>{displayedSynopsis}</p>
            {synopsisIsLong && (
              <button
                className={styles.expandBtn}
                onClick={() => setSynopsisExpanded((v) => !v)}
              >
                {synopsisExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}

        {/* Where to Watch */}
        {hasProviders && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Where to Watch</h2>
            {streamingProviders.length > 0 && (
              <div className={styles.providerGroup}>
                <span className={styles.providerGroupLabel}>Stream</span>
                <div className={styles.providerRow}>
                  {streamingProviders.map((p) => (
                    <img
                      key={p.provider_id}
                      src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                      alt={p.provider_name}
                      title={p.provider_name}
                      className={styles.providerLogo}
                    />
                  ))}
                </div>
              </div>
            )}
            {rentProviders.length > 0 && (
              <div className={styles.providerGroup}>
                <span className={styles.providerGroupLabel}>Rent</span>
                <div className={styles.providerRow}>
                  {rentProviders.map((p) => (
                    <img
                      key={p.provider_id}
                      src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                      alt={p.provider_name}
                      title={p.provider_name}
                      className={styles.providerLogo}
                    />
                  ))}
                </div>
              </div>
            )}
            {buyProviders.length > 0 && (
              <div className={styles.providerGroup}>
                <span className={styles.providerGroupLabel}>Buy</span>
                <div className={styles.providerRow}>
                  {buyProviders.map((p) => (
                    <img
                      key={p.provider_id}
                      src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                      alt={p.provider_name}
                      title={p.provider_name}
                      className={styles.providerLogo}
                    />
                  ))}
                </div>
              </div>
            )}
            <p className={styles.providerAttribution}>
              Streaming data provided by JustWatch
            </p>
          </div>
        )}

        {/* Details */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Details</h2>
          <div className={styles.details}>
            {direc && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Director</span>
                <button
                  className={styles.detailLink}
                  onClick={() => navigate(`/directors/${direc.id}`)}
                >
                  {direc.name}
                </button>
              </div>
            )}
            {stars && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Starring</span>
                <span className={styles.detailValue}>{stars}</span>
              </div>
            )}
            {movie.release_date && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Released</span>
                <span className={styles.detailValue}>{movie.release_date}</span>
              </div>
            )}
            {movie.original_language && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Language</span>
                <span className={styles.detailValue}>
                  {new Intl.DisplayNames(["en"], { type: "language" }).of(
                    movie.original_language,
                  )}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Friends Activity — placeholder */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Friends Activity</h2>
          <div className={styles.placeholderCard}>
            <p className={styles.placeholderText}>
              See which friends have watched or saved this film.
            </p>
            <p className={styles.placeholderSubtext}>Coming soon</p>
          </div>
        </div>

        {/* More from this Director */}
        {directorFilms.length > 0 && direc && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>More from {direc.name}</h2>
              <button
                className={styles.sectionLink}
                onClick={() => navigate(`/directors/${direc.id}`)}
              >
                See all
              </button>
            </div>
            <div className={styles.similarScroll}>
              {directorFilms.map((film) => (
                <button
                  key={film.id}
                  className={styles.similarCard}
                  onClick={() => navigate(`/movies/${film.id}`)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w185${film.poster_path}`}
                    alt={film.title}
                    className={styles.similarPoster}
                  />
                  <p className={styles.similarTitle}>{film.title}</p>
                  <p className={styles.similarYear}>
                    {film.release_date?.slice(0, 4)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* You Might Also Like */}
        {similarFilms.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>You Might Also Like</h2>
            <div className={styles.similarScroll}>
              {similarFilms.map((film) => (
                <button
                  key={film.id}
                  className={styles.similarCard}
                  onClick={() => navigate(`/movies/${film.id}`)}
                >
                  {film.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${film.poster_path}`}
                      alt={film.title}
                      className={styles.similarPoster}
                    />
                  ) : (
                    <div className={styles.similarPosterFallback} />
                  )}
                  <p className={styles.similarTitle}>{film.title}</p>
                  <p className={styles.similarYear}>
                    {film.release_date?.slice(0, 4)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Trailer Modal ── */}
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
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <iframe
              className={styles.iframe}
              src={`https://www.youtube.com/embed/${youtubeCode}?autoplay=1`}
              allowFullScreen
              title={`${movie.title} trailer`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
