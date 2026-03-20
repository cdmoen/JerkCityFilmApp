import { useState, useEffect, useRef } from "react";
import MovieCard from "./MovieCard";
import { fetchMovieSearch } from "../../modules/fetchers";
import { useWatchlist } from "../../hooks/useWatchlist";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./MovieSearchPage.module.css";

const BATCH_SIZE = 5;

export default function MovieSearchPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [movieIDs, setMovieIDs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [activeTrailer, setActiveTrailer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { watchlist, addFilm, removeFilm } = useWatchlist(user?.uid);
  const sentinelRef = useRef(null);

  // Set up add button context for the navbar
  useEffect(() => {
    // On this page, the add button should open search (focus the input)
    window.openAddFilmSheet = () => {
      document.querySelector(`.${styles.input}`)?.focus();
    };

    return () => {
      window.openAddFilmSheet = null;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!searchParams.trim()) return;

    setIsLoading(true);
    try {
      const data = await fetchMovieSearch(searchParams);
      setSearchResults(data);
      setMovieIDs(data.results.map((movie) => movie.id));
      setVisibleCount(BATCH_SIZE);
    } catch (err) {
      console.error(err);
      setSearchResults(null);
      setMovieIDs([]);
    } finally {
      setIsLoading(false);
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
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Discover Films</h1>
        <p className={styles.pageSubtitle}>
          Search thousands of films from across cinema history
        </p>
      </header>

      {/* Search Section */}
      <div className={styles.searchSection}>
        <form className={styles.searchForm} onSubmit={handleSubmit}>
          <div className={styles.searchBar}>
            <input
              className={styles.input}
              type="text"
              placeholder="Search films, directors, actors..."
              aria-label="Search movies"
              value={searchParams}
              onChange={(e) => setSearchParams(e.target.value)}
              autoComplete="off"
              autoCapitalize="none"
            />
            <button
              className={styles.searchButton}
              type="submit"
              disabled={!searchParams.trim() || isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {isLoading && (
        <div className={styles.loadingContainer}>
          <p className={styles.loadingText}>Searching films...</p>
        </div>
      )}

      {searchResults && !isLoading && (
        <div className={styles.resultsSection}>
          <div className={styles.resultsHeader}>
            <h2 className={styles.resultsTitle}>Search Results</h2>
            <span className={styles.resultsCount}>
              {searchResults.total_results?.toLocaleString() || movieIDs.length}{" "}
              films found
            </span>
          </div>

          {movieIDs.length > 0 ? (
            <>
              <ul className={styles.resultsList}>
                {visibleIDs.map((movieID) => (
                  <li key={movieID} className={styles.resultItem}>
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

              {hasMore && (
                <div className={styles.loadingMore}>
                  <div ref={sentinelRef} className={styles.sentinel} />
                  <p className={styles.loadingMoreText}>
                    Loading more films...
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>No films found</p>
              <p className={styles.emptySub}>
                Try different search terms or check your spelling
              </p>
            </div>
          )}
        </div>
      )}

      {!searchResults && !isLoading && (
        <div className={styles.welcomeState}>
          <div className={styles.welcomeContent}>
            <h3 className={styles.welcomeTitle}>Start Exploring</h3>
            <p className={styles.welcomeText}>
              Search for films by title, director, actor, or any keyword.
              Discover your next favorite film from our extensive database.
            </p>
          </div>
        </div>
      )}

      {/* Trailer Modal */}
      {activeTrailer && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setActiveTrailer(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeModalBtn}
              onClick={() => setActiveTrailer(null)}
              aria-label="Close trailer"
            >
              ×
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${activeTrailer}?autoplay=1`}
              allowFullScreen
              className={styles.trailer}
            />
          </div>
        </div>
      )}
    </div>
  );
}
