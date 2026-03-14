import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../modules/firebase";

export function useGroupFilms(groupId) {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    if (!groupId) return;

    const filmsRef = ref(database, `groups/${groupId}/films`);

    return onValue(filmsRef, (snap) => {
      if (!snap.exists()) {
        setFilms([]);
        return;
      }

      const data = snap.val();
      const list = Object.entries(data).map(([filmId, film]) => ({
        id: filmId,
        ...film,
      }));

      setFilms(list);
    });
  }, [groupId]);

  return films;
}
