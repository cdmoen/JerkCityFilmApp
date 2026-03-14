import { database } from "../firebase";
import { ref, set } from "firebase/database";
import { fetchMovieInfo } from "../fetchers";
import {
  director,
  topThreeStars,
  youtubeTrailer,
} from "../movieDatabaseHelpers";

export async function addFilmToGroup(groupId, uid, tmdbId) {
  let film;
  let directorName;
  let topThreeStarsNames;
  let youtubeTrailerLink;

  // 1. Fetch metadata from TMDB
  try {
    film = await fetchMovieInfo(tmdbId);
  } catch (err) {
    console.log("fetchMovieInfo from TMDB failed");
    return false;
  }
  // 2. Build the Firebase path
  // Using tmdbId as the filmId keeps things simple and avoids duplicates
  const filmRef = ref(database, `groups/${groupId}/films/${tmdbId}`);

  // Extract director, top three stars, and trailer link from movie object:
  try {
    directorName = await director(film);
    topThreeStarsNames = await topThreeStars(film);
    youtubeTrailerLink = await youtubeTrailer(film);
  } catch (err) {
    console.log(err);
  }
  // 3. Write the film object into Firebase
  await set(filmRef, {
    title: film.title,
    tmdbId: film.id,
    posterURL: `https://image.tmdb.org/t/p/w200/${film.poster_path}`,
    addedBy: uid,
    genres: film.genres
      .map((genre) => genre.name)
      .slice(0, 3)
      .join(", "),
    overview: film.overview,
    releaseDate: film.release_date,
    runtime: film.runtime,
    director: directorName ?? "no director info available",
    topThreeStars: topThreeStarsNames ?? "no cast info available",
    youtubeTrailer: youtubeTrailerLink
      ? `https://www.youtube.com/embed/${youtubeTrailerLink}`
      : "No trailer available",
    addedAt: Date.now(),
  });

  return true;
}
