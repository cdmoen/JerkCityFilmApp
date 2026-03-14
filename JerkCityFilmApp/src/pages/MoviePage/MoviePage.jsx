import {
  youtubeTrailer,
  director,
  topThreeStars,
} from "../../modules/movieDatabaseHelpers";
import { fetchMovieInfo } from "../../modules/fetchers";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./MoviePage.module.css";

export default function MoviePage() {
  const { user, logout } = useAuth();
  const { movieID } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true);
        setError(null);
        console.log("MOVIE ID OBJECT IS THIS:   " + movieID);
        const data = await fetchMovieInfo(movieID);
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [movieID]); // <-- correct dependency

  if (loading) return <p className="loading">Loading movie...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!movie) return <p className="error">Movie not found.</p>;

  // Now that movie is loaded, compute helpers safely
  const direc = director(movie);
  const stars = topThreeStars(movie);
  const youtubeCode = youtubeTrailer(movie);

  return (
    <div className="movie-container">
      <h1>{movie.title}</h1>
      <img
        className="movie-poster"
        src={`https://image.tmdb.org/t/p/w780/${movie.backdrop_path || "ss4GSbqZy2xKumjWD48dU2cZQ31.jpg"}`}
        alt={`${movie.title} Poster`}
      />

      <div className="movie-info">
        <p className="movie-year">
          {movie.release_date.slice(0, 4)} •{" "}
          {movie.genres?.map((genre) => genre.name).join(", ")}
        </p>

        <p className="movie-description">{movie.overview}</p>

        <ul className="movie-details">
          <li>
            <strong>Director:</strong> {direc}
          </li>
          <li>
            <strong>Starring:</strong> {stars}
          </li>
          <li>
            <strong>Runtime:</strong> {movie.runtime}
          </li>
        </ul>
      </div>
    </div>
  );
}
