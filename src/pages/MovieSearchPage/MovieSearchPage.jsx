import { useState, useEffect, useRef } from "react";
import MovieCard from "./MovieCard";
import { fetchMovieSearch } from "../../modules/fetchers";
import { useWatchlist } from "../../hooks/useWatchlist";
import { useAuth } from "../../contexts/AuthContext";

import styles from "./MovieSearchPage.module.css";

const BATCH_SIZE = 5;

export default function MovieSearchPage() {
  const { user, logout, profile, loading } = useAuth();
  const [searchParams, setSearchParams] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [movieIDs, setMovieIDs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [activeTrailer, setActiveTrailer] = useState(null);
  const { watchlist, addFilm, removeFilm } = useWatchlist(user?.uid);
  const sentinelRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await fetchMovieSearch(searchParams);
      setSearchResults(data);
      setMovieIDs(data.results.map((movie) => movie.id));
      setVisibleCount(BATCH_SIZE);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!sentinelRef.current) return;
    const hasMore = visibleCount < movieIDs.length;
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + BATCH_SIZE, movieIDs.length),
          );
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [visibleCount, movieIDs]);

  const visibleIDs = movieIDs.slice(0, visibleCount);
  const hasMore = visibleCount < movieIDs.length;

  return (
    <main className={styles.container}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>Search Movies</h2>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            placeholder="Search"
            aria-label="Search movies"
            value={searchParams}
            onChange={(e) => setSearchParams(e.target.value)}
            required
          />
          <button className={styles.button} type="submit">
            Search
          </button>
        </form>
      </div>

      {searchResults && (
        <>
          <ul className={styles.resultsList}>
            {visibleIDs.map((movieID) => (
              <li key={movieID}>
                <MovieCard
                  user={user}
                  movieID={movieID}
                  watchlist={watchlist}
                  addFilm={addFilm}
                  onTrailerClick={setActiveTrailer}
                />
              </li>
            ))}
          </ul>

          {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}
        </>
      )}

      {activeTrailer && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setActiveTrailer(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube.com/embed/${activeTrailer}?autoplay=1`}
              allowFullScreen
            />
          </div>
        </div>
      )}
    </main>
  );
}
