import { useEffect, useState } from "react";
import { ref, onValue, set, remove, get } from "firebase/database";
import { database } from "../modules/firebase";

export function useWatchlist(uid) {
  const [watchlist, setWatchlist] = useState([]);
  const [username, setUsername] = useState(null);

  // Fetch the current user's username once on mount
  useEffect(() => {
    if (!uid) return;
    get(ref(database, `users/${uid}/username`)).then((snap) => {
      if (snap.exists()) setUsername(snap.val());
    });
  }, [uid]);

  useEffect(() => {
    if (!uid) return;

    const watchlistRef = ref(database, `watchlists/${uid}`);

    return onValue(watchlistRef, (snap) => {
      const data = snap.val();
      if (data) {
        const films = Object.entries(data).map(([filmId, film]) => ({
          id: filmId,
          ...film,
        }));
        setWatchlist(films);
      } else {
        setWatchlist([]);
      }
    });
  }, [uid]);

  async function addFilm(film) {
    // film.id MUST be the TMDB ID
    const filmRef = ref(database, `watchlists/${uid}/${film.id}`);
    await set(filmRef, film);

    // Write activity event
    const activityRef = ref(database, `activity/${uid}/${film.id}`);
    await set(activityRef, {
      filmId: String(film.id),
      title: film.title,
      poster: film.poster ?? null,
      year: film.year ?? null,
      username: username ?? null,
      addedAt: Date.now(),
    });
  }

  async function removeFilm(filmId) {
    const filmRef = ref(database, `watchlists/${uid}/${filmId}`);
    await remove(filmRef);

    // Remove activity event
    const activityRef = ref(database, `activity/${uid}/${filmId}`);
    await remove(activityRef);
  }

  return { watchlist, addFilm, removeFilm };
}
