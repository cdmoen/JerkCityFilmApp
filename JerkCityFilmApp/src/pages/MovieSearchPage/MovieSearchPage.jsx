import { useState } from "react";
import MovieCard from "./MovieCard";
import { fetchMovieSearch } from "../../modules/fetchers";
import styles from "./MovieSearchPage.module.css";

export default function MovieSearchPage() {
  const [searchParams, setSearchParams] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [movieIDs, setMovieIDs] = useState([]);

  // Search TMDB database for a film
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // search for movies using fetchMovieSearch
      const data = await fetchMovieSearch(searchParams);
      // searchResults is the full search response object containing lots of info
      setSearchResults(data);
      // movieIDs is just an array of IDs for every movie in the search results
      setMovieIDs(data.results.map((movie) => movie.id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main className={styles.container}>
      <h2 className={styles.title}>Search Movies</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          placeholder="Search"
          value={searchParams}
          onChange={(e) => setSearchParams(e.target.value)}
          required
        />
        <button className={styles.button} type="submit">
          Submit
        </button>
      </form>

      {searchResults && (
        <ul className={styles.resultsList}>
          {movieIDs.map((movieID) => (
            <li key={movieID}>
              <MovieCard movieID={movieID} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
