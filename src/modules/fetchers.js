/*

How API Requests Work in This Project
All network requests to The Movie Database (TMDB) are routed through Vercel Serverless Functions located in the /api directory. 
These files run on the server, not in the browser, which keeps the TMDB API key private.
When one of the fetcher functions below call something like:

/api/tmdb?path=movie/550&language=en-US

Vercel automatically executes the corresponding file:
api/tmdb.js

That backend function then does the following:

1.  Reads the secret TMDB key from the Vercel project's environment 
variables (those are not stored in the github repository - only on the Vercel website)

2. Forwards the request to the real TMDB API

3. Returns the JSON response back to the frontend

This lets the frontend fetch TMDB data securely without ever exposing the API key to the frontend.



==============================
    FETCH MOVIE SEARCH
==============================

This fetcher takes in a movie string param and returns a list of TMDB movies with the following info for each:

 "results": [
    {
      "adult": false,
      "backdrop_path": "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
      "genre_ids": [
        18,
        53,
        35
      ],
      "id": 550,
      "original_language": "en",
      "original_title": "Fight Club",
      "overview": "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground \"fight clubs\" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.",
      "popularity": 73.433,
      "poster_path": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      "release_date": "1999-10-15",
      "title": "Fight Club",
      "video": false,
      "vote_average": 8.433,
      "vote_count": 26279
    },
 */

export async function fetchMovieSearch(searchParams) {
  // Build the URL for your Vercel API route
  const url = `/api/tmdb?path=search/movie&query=${encodeURIComponent(
    searchParams,
  )}&include_adult=false&language=en-US&page=1`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("fetchMovieSearch failed");
  }

  console.log("fetchMovieSearch successful");
  return await response.json();
}

/*
==============================
    FETCH MOVIE DETAILS
==============================

This fetcher takes in a single TMDB movieID and returns the following information about the movie:

{
  "adult": false,
  "backdrop_path": "/c6OLXfKAk5BKeR6broC8pYiCquX.jpg",
  "belongs_to_collection": null,
  "budget": 63000000,
  "genres": [
    {
      "id": 18,
      "name": "Drama"
    },{},{}
  ],
  "homepage": "http://www.foxmovies.com/movies/fight-club",
  "id": 550,
  "imdb_id": "tt0137523",
  "origin_country": [
    "US"
  ],
  "original_language": "en",
  "original_title": "Fight Club",
  "overview": string,
  "popularity": 24.1623,
  "poster_path": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  "production_companies": [
    {
      "id": 711,
      "logo_path": "/tEiIH5QesdheJmDAqQwvtN60727.png",
      "name": "Fox 2000 Pictures",
      "origin_country": "US"
    },{}
  ],
  "production_countries": [],
  "release_date": "1999-10-15",
  "revenue": 100853753,
  "runtime": 139,
  "spoken_languages": [],
  "status": "Released",
  "tagline": "Mischief. Mayhem. Soap.",
  "title": "Fight Club",
  "video": false,
  "vote_average": 8.438,
  "vote_count": 31539,
  "credits": {
    "cast": [
      {
        "adult": false,
        "gender": 2,
        "id": 819,
        "known_for_department": "Acting",
        "name": "Edward Norton",
        "original_name": "Edward Norton",
        "popularity": 3.4121,
        "profile_path": "/8nytsqL59SFJTVYVrN72k6qkGgJ.jpg",
        "cast_id": 4,
        "character": "Narrator",
        "credit_id": "52fe4250c3a36847f80149f3",
        "order": 0
      }, 
{},
...],
    "crew": [
      {
        "adult": false,
        "gender": 2,
        "id": 7474,
        "known_for_department": "Production",
        "name": "Ross Grayson Bell",
        "original_name": "Ross Grayson Bell",
        "popularity": 0.0947,
        "profile_path": null,
        "credit_id": "52fe4250c3a36847f8014a05",
        "department": "Production",
        "job": "Producer"
      },
{},
...]
  },
  "videos": {
    "results": [
      {
        "iso_639_1": "en",
        "iso_3166_1": "US",
        "name": "Yeah... no wonder this movie never won an Oscar",
        "key": "V0Fqdb-smqo",
        "site": "YouTube",
        "size": 2160,
        "type": "Featurette",
        "official": false,
        "published_at": "2025-02-14T14:25:16.000Z",
        "id": "67c90f7a3dd7da394f24957b"
      },{},...]
  }
}
*/

export async function fetchMovieDetails(movieID) {
  const response = await fetch(
    `/api/tmdb?path=movie/${movieID}&append_to_response=credits,videos,images&language=en-US`,
  );

  if (!response.ok) {
    throw new Error("fetchCredits failed");
  }
  const movieInfo = await response.json();
  return movieInfo;
}
