import styles from "./FilmSearchResultCard.module.css";

export default function FilmSearchResultCard({ movie, onAdd }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : "/images/placeholder.svg";

  const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : "—";

  return (
    <div className={styles.card}>
      <img src={posterUrl} alt={movie.title} className={styles.poster} />

      <div className={styles.info}>
        <h3>{movie.title}</h3>
        <p>{releaseYear}</p>
      </div>

      <button className={styles.addButton} onClick={() => onAdd()}>
        Add
      </button>
    </div>
  );
}
