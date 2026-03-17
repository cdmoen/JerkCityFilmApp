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
  const [movie, setmovie] = useState(null);
  const [error, setError] = useState(null);

  function handleMovieClick(movieID) {
    navigate(`/movies/${movieID}`);
  }

  useEffect(() => {
    async function loadMovie() {
      try {
        const data = await fetchMovieDetails(movieID);
        setmovie(data);
      } catch (err) {
        console.error(err);
        setError(err);
      }
    }
    loadMovie();
  }, [movieID]);

  if (error) {
    return <p>Error loading movie.</p>;
  }

  if (!movie) {
    return <p>Loading...</p>;
  }

  const title = movie.title;
  const year = movie.release_date.slice(0, 4);
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
    <section className={styles.card}>
      <div
        className={styles.posterWrapper}
        onClick={() => handleMovieClick(movieID)}
      >
        <picture>
          <source media="(min-width: 768px)" srcSet={poster} />
          <img className={styles.poster} src={backdrop} alt={title} />
        </picture>
      </div>

      <section className={styles.info}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.year}>{year}</p>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.trailerButton}
            onClick={() => onTrailerClick(youtubeCode)}
          >
            ▶ Trailer
          </button>
          {user &&
            (isInWatchlist ? (
              <p className={styles.addedMessage}>✓ Watchlist</p>
            ) : (
              <button
                className={styles.watchlistButton}
                onClick={() => addFilm(filmForWatchlist)}
              >
                + Watchlist
              </button>
            ))}
        </div>

        <p className={styles.description}>
          <strong>Director: </strong>
          {direct}
        </p>
        <p className={styles.description}>
          <strong>Starring: </strong> {stars}
        </p>
      </section>
    </section>
  );
}
