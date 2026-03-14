/*

====================================
    NOTE ABOUT TMDB MOVIE POSTERS
====================================

The 'poster_path' for a film can be retrieved from the TMDB API using a fetcher
like fetchMovieInfo().  A usable image URL must then be constructed by appending
this path (a string) to the following URL:

https://image.tmdb.org/t/p/w200/

example usage:

https://image.tmdb.org/t/p/w200/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg

===========================
    NOTE ON IMAGE SIZES
============================

The base URL as seen here:

https://image.tmdb.org/t/p/w200/

can be modified to retrieve a variety of image sizes by replacing 'w200' with another value (e.g. w92, w45, w300, etc)

The full list of available sizes can be found here:
https://developer.themoviedb.org/reference/configuration-details

*/

// Takes in movieInfo object and returns top 3 most famous cast members
export function topThreeStars(movieInfo) {
  const cast = movieInfo.credits.cast;
  const topTenCast = cast.slice(0, 10);

  const topThreeStars = [...topTenCast]
    .sort((a, b) => a.popularity - b.popularity)
    .slice(0, 3);
  const names = topThreeStars.map((e) => e.name).join(", ");

  return names;
}

// Takes in movieInfo object and returns director
export function director(movieInfo) {
  const crew = movieInfo.credits.crew;
  const director = crew.find((member) => member.job === "Director");
  if (!director) {
    return null;
  }
  return director.name;
}

// Takes in movieInfo object and returns youtube embed code
export function youtubeTrailer(movieInfo) {
  const firstYoutubeLink = movieInfo.videos.results.find(
    (trailer) => trailer.site === "YouTube",
  );
  if (!firstYoutubeLink) {
    return null;
  }
  const youtubeCode = firstYoutubeLink.key;
  return youtubeCode;
}
