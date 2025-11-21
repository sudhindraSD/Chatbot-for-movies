import axios from "axios";

/**
 * tmdbService.js
 * --------------
 * Handles communication with The Movie Database (TMDB) API.
 * Provides:
 *  - getMovieRecommendations: discover movies by genre/length/rating
 *  - getMovieTrailer: fetch first YouTube trailer for a given movie
 */

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

if (!TMDB_API_KEY) {
  console.warn(
    "[TMDB] TMDB_API_KEY is not set. Movie endpoints will use fallback data."
  );
} else {
  console.log("[TMDB] TMDB_API_KEY is configured ✅");
}

// Map friendly genre names to TMDB genre IDs
// FULL TMDB GENRE LIST
const GENRE_MAP = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  "sci-fi": 878,
  scifi: 878,
  "science fiction": 878,
  tv: 10770,
  thriller: 53,
  war: 10752,
  western: 37,
};

// Map MOODS to GENRES (Fallback if user doesn't specify genre)
const MOOD_TO_GENRE_MAP = {
  energetic: "action",
  chill: "comedy",
  emotional: "drama",
  thrilling: "thriller",
  fun: "comedy",
  deep: "documentary",
  romantic: "romance",
  dark: "horror",
  surprise: "adventure", // Surprise me -> Adventure
};

/**
 * Build common TMDB params with API key.
 */
const withAuth = (params = {}) => ({
  api_key: TMDB_API_KEY,
  ...params,
});

/**
 * Get movie recommendations based on provided filters.
 *
 * @param {{ genre?: string, length?: string, rating?: string, page?: number, mood?: string }} options
 * @returns {Promise<Array>} Array of 20 normalized movie objects
 */
export const getMovieRecommendations = async (options = {}) => {
  const { genre, length = "any", rating = "any", page = 1, mood } = options;

  try {
    if (!TMDB_API_KEY) {
      throw new Error("TMDB_API_KEY is not configured");
    }

    // Fetch MULTIPLE pages for massive variety (60+ movies instead of 20)
    const pagesToFetch = 3; // Fetch 3 pages = 60 movies
    const randomStartPage =
      page > 1 ? page : Math.floor(Math.random() * 500) + 1; // 500 pages available!

    const baseParams = {
      sort_by: "popularity.desc",
      include_adult: false,
      include_video: false,
      "vote_count.gte": 50, // Lowered from 100 to get more variety
      language: "en-US",
    };

    // Genre filter - ROBUST MAPPING
    let targetGenre = genre;

    // If no genre specified but mood is present, use mood mapping
    if ((!targetGenre || targetGenre === "any") && mood) {
      targetGenre = MOOD_TO_GENRE_MAP[mood.toLowerCase()] || "action";
      console.log(
        `[TMDB] No genre specified, mapping mood "${mood}" to "${targetGenre}"`
      );
    }

    if (targetGenre) {
      const normalized = targetGenre.toLowerCase().trim();

      // Try exact match
      let genreId = GENRE_MAP[normalized];

      // Try partial match if exact fails (e.g. "romantic comedy" -> "romance")
      if (!genreId) {
        const keys = Object.keys(GENRE_MAP);
        const match = keys.find((k) => normalized.includes(k));
        if (match) {
          genreId = GENRE_MAP[match];
          console.log(
            `[TMDB] Fuzzy matched genre "${targetGenre}" to "${match}" (${genreId})`
          );
        }
      }

      if (genreId) {
        params.with_genres = genreId;
      } else {
        console.warn(
          `[TMDB] Unknown genre "${targetGenre}", falling back to popularity`
        );
      }
    }

    // Runtime filter
    if (length === "short") {
      params["with_runtime.lte"] = 100;
    } else if (length === "long") {
      params["with_runtime.gte"] = 100;
    }

    // Certification filter (US-based)
    if (rating === "pg") {
      params["certification_country"] = "US";
      params["certification.lte"] = "PG-13";
    } else if (rating === "teen") {
      params["certification_country"] = "US";
      params["certification.gte"] = "PG-13";
      params["certification.lte"] = "R";
    } else if (rating === "mature") {
      // No certification filter => allow anything
    }

    console.log("[TMDB] Fetching recommendations with params:", baseParams);
    console.log(
      `[TMDB] Fetching ${pagesToFetch} pages starting from page ${randomStartPage}`
    );

    // Fetch multiple pages in parallel for speed
    const pagePromises = [];
    for (let i = 0; i < pagesToFetch; i++) {
      const pageNum = randomStartPage + i;
      pagePromises.push(
        axios.get(`${TMDB_BASE_URL}/discover/movie`, {
          params: withAuth({ ...baseParams, page: pageNum }),
        })
      );
    }

    const responses = await Promise.all(pagePromises);
    const results = responses.flatMap((r) => r?.data?.results || []);

    console.log(
      `[TMDB] Successfully fetched ${results.length} movies from ${pagesToFetch} pages`
    );

    if (results.length === 0) {
      console.warn("[TMDB] No results found for params, trying popular movies");
      // Fallback: fetch 3 pages of popular movies
      const fallbackPromises = [];
      for (let i = 0; i < 3; i++) {
        fallbackPromises.push(
          axios.get(`${TMDB_BASE_URL}/movie/popular`, {
            params: withAuth({ page: randomStartPage + i }),
          })
        );
      }
      const fallbackResponses = await Promise.all(fallbackPromises);
      const fallbackResults = fallbackResponses.flatMap(
        (r) => r?.data?.results || []
      );
      return fallbackResults.map(normalizeMovie);
    }

    // Shuffle results for extra randomness and return ALL movies (60+)
    const shuffled = results.sort(() => Math.random() - 0.5);
    console.log(`[TMDB] Returning ${shuffled.length} shuffled movies`);
    return shuffled.map(normalizeMovie);
  } catch (error) {
    console.error("[TMDB] Error fetching movie recommendations:");
    console.error("[TMDB DEBUG] Full error:", error.message);
    console.error("[TMDB DEBUG] Status:", error?.response?.status);
    console.error("[TMDB DEBUG] Response body:", error?.response?.data);
    console.error("[TMDB DEBUG] Request URL:", error?.config?.url);
    console.error("[TMDB DEBUG] API Key present:", !!TMDB_API_KEY);
    console.error(
      "[TMDB DEBUG] API Key (first 8 chars):",
      TMDB_API_KEY?.substring(0, 8)
    );
    throw new Error("Failed to fetch movie recommendations");
  }
};

const normalizeMovie = (movie) => ({
  id: movie.id,
  title: movie.title,
  poster: movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : null,
  rating: movie.vote_average,
  overview: movie.overview,
  releaseYear: movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null,
});

/**
 * Get YouTube trailer URL for a given TMDB movie ID.
 *
 * @param {number|string} movieId
 * @returns {Promise<string|null>} Full YouTube URL or null if not found
 */
export const getMovieTrailer = async (movieId) => {
  try {
    if (!TMDB_API_KEY) {
      throw new Error("TMDB_API_KEY is not configured");
    }

    console.log(`[TMDB] Fetching trailer for movieId=${movieId}`);

    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/${movieId}/videos`,
      {
        params: withAuth({ language: "en-US" }),
      }
    );

    const videos = response?.data?.results || [];

    const trailer = videos.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );

    if (!trailer) {
      return null;
    }

    return `https://www.youtube.com/watch?v=${trailer.key}`;
  } catch (error) {
    console.error(
      "[TMDB] Error fetching movie trailer:",
      error?.response?.data || error.message
    );
    return null; // Gracefully degrade if trailer can't be fetched
  }
};
