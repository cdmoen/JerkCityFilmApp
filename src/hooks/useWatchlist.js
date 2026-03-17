import { useEffect, useState } from "react";
import { ref, onValue, set, remove } from "firebase/database";
import { database } from "../modules/firebase";

export function useWatchlist(uid) {
  const [watchlist, setWatchlist] = useState([]);

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
  }

  async function removeFilm(filmId) {
    const filmRef = ref(database, `watchlists/${uid}/${filmId}`);
    await remove(filmRef);
  }

  return { watchlist, addFilm, removeFilm };
}
