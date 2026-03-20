import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./DirectorPage.module.css";

const TMDB_AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNDRhMzU5M2M5M2ExYjA4M2Q2ZmNjYjE1Mzk1Zjc5ZCIsIm5iZiI6MTc3MTYxNDI2NS4wMjgsInN1YiI6IjY5OThiMDM5NDlkODE1ZDRiY2M5OWNjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-4R9PwE931m9oQjt5seK2Opvw6erzfZX47c7CPGYxgw";

async function fetchPersonDetails(personId) {
  const url = `https://api.themoviedb.org/3/person/${personId}?language=en-US`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TMDB_AUTH_TOKEN}`,
    },
  });
  if (!response.ok) throw new Error("Could not load director details");
  return response.json();
}

async function fetchDirectorFilmography(personId) {
  const url = `https://api.themoviedb.org/3/person/${personId}/movie_credits`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TMDB_AUTH_TOKEN}`,
    },
  });
  if (!response.ok) throw new Error("Could not load filmography");
  const data = await response.json();
  return (
    (data.crew ?? [])
      .filter((f) => f.job === "Director")
      // Deduplicate by id (a film can appear twice if they have two Director credits)
      .filter((f, idx, arr) => arr.findIndex((x) => x.id === f.id) === idx)
      .sort((a, b) => {
        if (!a.release_date) return 1;
        if (!b.release_date) return -1;
        return b.release_date.localeCompare(a.release_date);
      })
  );
}

const BIO_THRESHOLD = 300;

export default function DirectorPage() {
  const { directorID } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bioExpanded, setBioExpanded] = useState(false);

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true);
        setError(null);
        setBioExpanded(false);
        const [personData, filmData] = await Promise.all([
          fetchPersonDetails(directorID),
          fetchDirectorFilmography(directorID),
        ]);
        setPerson(personData);
        setFilms(filmData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPage();
  }, [directorID]);

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

  if (!person) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>Director not found.</div>
      </div>
    );
  }

  const photo = person.profile_path
    ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
    : null;

  const bioIsLong = person.biography?.length > BIO_THRESHOLD;
  const displayedBio =
    bioIsLong && !bioExpanded
      ? person.biography.slice(0, BIO_THRESHOLD).trimEnd() + "…"
      : person.biography;

  const knownFilms = films.filter((f) => f.poster_path);
  const filmCount = films.length;

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
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
      </div>

      {/* ── Director Identity ── */}
      <div className={styles.identity}>
        {photo ? (
          <img src={photo} alt={person.name} className={styles.photo} />
        ) : (
          <div className={styles.photoFallback} />
        )}
        <div className={styles.identityText}>
          <h1 className={styles.name}>{person.name}</h1>
          <p className={styles.meta}>
            Director
            {person.birthday && (
              <>
                <span className={styles.separator}>·</span>
                b. {person.birthday.slice(0, 4)}
              </>
            )}
            {person.place_of_birth && (
              <>
                <span className={styles.separator}>·</span>
                {person.place_of_birth}
              </>
            )}
          </p>
          <p className={styles.filmCount}>
            {filmCount} {filmCount === 1 ? "film" : "films"}
          </p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className={styles.body}>
        {/* Biography */}
        {person.biography && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Biography</h2>
            <p className={styles.bio}>{displayedBio}</p>
            {bioIsLong && (
              <button
                className={styles.expandBtn}
                onClick={() => setBioExpanded((v) => !v)}
              >
                {bioExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}

        {/* Filmography */}
        {knownFilms.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Filmography</h2>
            <div className={styles.grid}>
              {knownFilms.map((film) => (
                <button
                  key={film.id}
                  className={styles.filmCard}
                  onClick={() => navigate(`/movies/${film.id}`)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w185${film.poster_path}`}
                    alt={film.title}
                    className={styles.filmPoster}
                  />
                  <p className={styles.filmTitle}>{film.title}</p>
                  <p className={styles.filmYear}>
                    {film.release_date?.slice(0, 4)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
