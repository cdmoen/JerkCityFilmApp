import { ref, set } from "firebase/database";
import { database } from "../firebase";

// Mark film as viewed
export function markFilmAsViewed(groupId, filmId, uid, profile) {
  const seenRef = ref(
    database,
    `groups/${groupId}/films/${filmId}/seen/${uid}`,
  );
  return set(seenRef, {
    uid,
    username: profile.username,
    avatarUrl: profile.avatarUrl,
  });
}

// Add or update rating
export function rateFilm(groupId, filmId, uid, rating, profile) {
  const ratingRef = ref(
    database,
    `groups/${groupId}/films/${filmId}/ratings/${uid}`,
  );
  return set(ratingRef, {
    rating: rating,
    username: profile.username,
    avatarUrl: profile.avatarUrl,
  });
}
