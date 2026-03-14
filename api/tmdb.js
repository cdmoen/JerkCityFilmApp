/*This backend function takes in a fetch from the frontend,
reconstructs it and adds in the secret API key for the TMDB, sends its own
fetch to TMDB, receives the response json from TMDB, and then forwards that json
back to the frontend. 
*/

export default async function handler(req, res) {
  const { path, ...query } = req.query;

  const url = new URL(`https://api.themoviedb.org/3/${path}`);
  url.searchParams.set("api_key", process.env.TMDB_API_KEY);

  // Forward any additional query params
  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, value);
  }

  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "TMDB request failed" });
  }
}
