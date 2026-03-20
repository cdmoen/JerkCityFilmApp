import { useState, useRef, useEffect } from "react";
import { fetchMovieSearch } from "../../modules/fetchers";
import GroupFilmResultCard from "./GroupFilmResultCard";
import styles from "./AddFilmToGroupSheet.module.css";

export default function AddFilmToGroupSheet({
  isOpen,
  onClose,
  onAdd,
  groupFilms, // array of film objects already in the group
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // ── Drag-to-close ──
  const sheetRef = useRef(null);
  const handleRef = useRef(null);
  const dragStart = useRef(null);
  const dragYRef = useRef(0);
  const [dragY, setDragY] = useState(0);

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;

    handle.addEventListener("touchstart", handleTouchStart, { passive: true });
    handle.addEventListener("touchmove", handleTouchMove, { passive: false });
    handle.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      handle.removeEventListener("touchstart", handleTouchStart);
      handle.removeEventListener("touchmove", handleTouchMove);
      handle.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isOpen]);

  function handleTouchStart(e) {
    dragStart.current = e.touches[0].clientY;
  }

  function handleTouchMove(e) {
    e.preventDefault();
    const delta = e.touches[0].clientY - dragStart.current;
    if (delta > 0) {
      dragYRef.current = delta;
      setDragY(delta);
    }
  }

  function handleTouchEnd() {
    if (dragYRef.current > 80) handleClose();
    dragYRef.current = 0;
    setDragY(0);
  }

  // ── Search ──
  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await fetchMovieSearch(query);
      setResults(data.results.slice(0, 10));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(movie) {
    await onAdd(movie);
    handleClose();
  }

  function handleClose() {
    setQuery("");
    setResults([]);
    setHasSearched(false);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div
        ref={sheetRef}
        className={`${styles.sheet} ${dragY === 0 ? styles.sheetAnimateIn : ""}`}
        style={{
          transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
          transition: dragY > 0 ? "none" : undefined,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={handleRef} className={styles.dragHandle}>
          <div className={styles.dragPill} />
        </div>

        <div className={styles.header}>
          <h2 className={styles.title}>Add Film to Group</h2>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search films…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.searchInput}
              autoComplete="off"
              autoCapitalize="none"
            />
            <button
              type="submit"
              className={styles.searchButton}
              disabled={!query.trim() || loading}
            >
              {loading ? "Searching…" : "Search"}
            </button>
          </div>
        </form>

        {loading && (
          <div className={styles.loadingContainer}>
            <p className={styles.loading}>Searching films…</p>
          </div>
        )}

        <div className={styles.results}>
          {results.length > 0 && (
            <div className={styles.resultsHeader}>
              <span className={styles.resultsCount}>{results.length} results</span>
            </div>
          )}

          <div className={styles.resultsList}>
            {results.map((movie) => (
              <GroupFilmResultCard
                key={movie.id}
                movie={movie}
                groupFilms={groupFilms}
                onAdd={() => handleAdd(movie)}
              />
            ))}
          </div>

          {results.length === 0 && hasSearched && !loading && (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>No films found</p>
              <p className={styles.emptySub}>Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
