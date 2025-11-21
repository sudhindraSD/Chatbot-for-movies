import axios from "axios";

/**
 * TMDB Multi-Endpoint Service - MAXIMUM VARIETY
 * Hits 16 different TMDB endpoints in parallel for 300-500 movies
 */

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Genre mapping
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
  "science fiction": 878,
  "sci-fi": 878,
  thriller: 53,
  war: 10752,
  western: 37,
};

// Mood to genre mapping
const MOOD_TO_GENRE = {
  emotional: [18, 10749], // Drama, Romance
  fun: [35, 12], // Comedy, Adventure
  chill: [35, 10751], // Comedy, Family
  thrilling: [53, 27], // Thriller, Horror
  dark: [27, 80], // Horror, Crime
  energetic: [28, 12], // Action, Adventure
  romantic: [10749, 35], // Romance, Comedy
  deep: [18, 99], // Drama, Documentary
  surprise: [12, 14], // Adventure, Fantasy
};

/**
 * Fetch movies from MULTIPLE TMDB endpoints for maximum variety
 */
export const getMultiEndpointMovies = async ({
  genre = "",
  mood = "",
  length = "",
  rating = "",
}) => {
  try {
    console.log("[TMDB-MULTI] Starting multi-endpoint fetch with params:", {
      genre,
      mood,
      length,
      rating,
    });

    // Runtime API key check with debug info
    const runtimeApiKey = process.env.TMDB_API_KEY;
    console.log(
      "[TMDB-MULTI DEBUG] API Key at runtime:",
      runtimeApiKey ? `${runtimeApiKey.substring(0, 8)}...` : "UNDEFINED"
    );
    console.log(
      "[TMDB-MULTI DEBUG] All env keys:",
      Object.keys(process.env).filter((k) => k.includes("TMDB"))
    );

    if (!runtimeApiKey) {
      throw new Error("TMDB API key is not configured");
    }

    // Use runtime API key instead of module-level constant
    const apiKey = runtimeApiKey;

    // Determine genre IDs
    let genreIds = [];

    if (genre) {
      const genreId = GENRE_MAP[genre.toLowerCase()];
      if (genreId) genreIds.push(genreId);
    }

    if (mood && MOOD_TO_GENRE[mood.toLowerCase()]) {
      genreIds = [...genreIds, ...MOOD_TO_GENRE[mood.toLowerCase()]];
    }

    // Remove duplicates
    genreIds = [...new Set(genreIds)];

    // Build base params
    const baseParams = {
      api_key: apiKey,
      language: "en-US",
      sort_by: "popularity.desc",
      include_adult: rating?.toLowerCase() === "mature",
      "vote_count.gte": 50,
      with_original_language: "en",
    };

    // Add genre filter if specified
    if (genreIds.length > 0) {
      baseParams.with_genres = genreIds.join(",");
    }

    // Length mapping (runtime in minutes)
    if (length) {
      if (
        length.toLowerCase().includes("short") ||
        length.toLowerCase().includes("quick")
      ) {
        baseParams["with_runtime.lte"] = 100; // Under 100 minutes
      } else if (
        length.toLowerCase().includes("long") ||
        length.toLowerCase().includes("epic")
      ) {
        baseParams["with_runtime.gte"] = 140; // Over 140 minutes
      }
    }

    // **HIT MULTIPLE ENDPOINTS IN PARALLEL FOR MASSIVE VARIETY**
    const requests = [];

    console.log("[TMDB-MULTI] Building 16 parallel requests...");

    // 1. CLASSIC MOVIES (before 1990) - 3 requests
    for (let i = 1; i <= 3; i++) {
      requests.push(
        axios.get(`${TMDB_BASE_URL}/discover/movie`, {
          params: {
            ...baseParams,
            "primary_release_date.lte": "1990-12-31",
            "vote_average.gte": 6.5,
            page: Math.floor(Math.random() * 50) + 1,
          },
        })
      );
    }

    // 2. GOLDEN ERA (1990-2010) - 3 requests
    for (let i = 1; i <= 3; i++) {
      requests.push(
        axios.get(`${TMDB_BASE_URL}/discover/movie`, {
          params: {
            ...baseParams,
            "primary_release_date.gte": "1990-01-01",
            "primary_release_date.lte": "2010-12-31",
            "vote_average.gte": 6.0,
            page: Math.floor(Math.random() * 100) + 1,
          },
        })
      );
    }

    // 3. MODERN HITS (2011-2020) - 3 requests
    for (let i = 1; i <= 3; i++) {
      requests.push(
        axios.get(`${TMDB_BASE_URL}/discover/movie`, {
          params: {
            ...baseParams,
            "primary_release_date.gte": "2011-01-01",
            "primary_release_date.lte": "2020-12-31",
            "vote_average.gte": 6.5,
            page: Math.floor(Math.random() * 200) + 1,
          },
        })
      );
    }

    // 4. RECENT BLOCKBUSTERS (2021-2024) - 3 requests
    for (let i = 1; i <= 3; i++) {
      requests.push(
        axios.get(`${TMDB_BASE_URL}/discover/movie`, {
          params: {
            ...baseParams,
            "primary_release_date.gte": "2021-01-01",
            "vote_average.gte": 6.0,
            page: Math.floor(Math.random() * 100) + 1,
          },
        })
      );
    }

    // 5. HIGH RATED GEMS (all time) - 2 requests
    for (let i = 1; i <= 2; i++) {
      requests.push(
        axios.get(`${TMDB_BASE_URL}/discover/movie`, {
          params: {
            ...baseParams,
            "vote_average.gte": 7.5,
            "vote_count.gte": 500,
            page: Math.floor(Math.random() * 150) + 1,
          },
        })
      );
    }

    // 6. HIDDEN GEMS (lower vote count but decent rating) - 2 requests
    for (let i = 1; i <= 2; i++) {
      requests.push(
        axios.get(`${TMDB_BASE_URL}/discover/movie`, {
          params: {
            ...baseParams,
            "vote_average.gte": 6.5,
            "vote_count.gte": 100,
            "vote_count.lte": 1000,
            page: Math.floor(Math.random() * 300) + 1,
          },
        })
      );
    }

    // 7. INDIAN CINEMA DOMINATION (60-70% of total) - 15 requests
    // Languages: Hindi (hi), Kannada (kn), Telugu (te), Tamil (ta), Malayalam (ml)
    const indianLanguages = "hi|kn|te|ta|ml";
    for (let i = 1; i <= 15; i++) {
      requests.push(
        axios.get(`${TMDB_BASE_URL}/discover/movie`, {
          params: {
            ...baseParams,
            with_original_language: indianLanguages, // Override 'en'
            "primary_release_date.gte": "2000-01-01", // Wider date range for more classics
            "vote_average.gte": 5.5, // Slightly lower threshold to get more mass entertainers
            page: Math.floor(Math.random() * 50) + 1,
          },
        })
      );
    }

    console.log(
      `[TMDB-MULTI] 🚀 Firing ${requests.length} parallel requests...`
    );

    // Execute all requests in parallel
    const responses = await Promise.all(requests);

    // Combine all results
    let allMovies = [];
    responses.forEach((response, index) => {
      if (response.data && response.data.results) {
        console.log(
          `[TMDB-MULTI] Endpoint ${index + 1} returned ${response.data.results.length
          } movies`
        );
        allMovies = allMovies.concat(response.data.results);
      }
    });

    console.log(
      `[TMDB-MULTI] Combined ${allMovies.length} movies from ${responses.length} endpoints`
    );

    // Remove duplicates by ID
    const uniqueMovies = Array.from(
      new Map(allMovies.map((movie) => [movie.id, movie])).values()
    );

    console.log(
      `[TMDB-MULTI] ${uniqueMovies.length} unique movies after deduplication`
    );

    // Shuffle for randomness
    const shuffled = uniqueMovies.sort(() => Math.random() - 0.5);

    // Take top 100
    const finalMovies = shuffled.slice(0, 100);

    // Format movies
    const formattedMovies = finalMovies.map((movie) => ({
      id: movie.id,
      title: movie.title || movie.original_title,
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Poster",
      backdrop: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : null,
      overview: movie.overview || "No description available.",
      rating: movie.vote_average
        ? parseFloat(movie.vote_average.toFixed(1))
        : 6.0,
      releaseYear: movie.release_date
        ? movie.release_date.split("-")[0]
        : "Unknown",
      voteCount: movie.vote_count || 0,
      popularity: movie.popularity || 0,
    }));

    console.log(
      `[TMDB-MULTI] ✅ Successfully formatted ${formattedMovies.length} unique movies`
    );

    return formattedMovies;
  } catch (error) {
    console.error(
      "[TMDB-MULTI] ❌ Error fetching movie recommendations:",
      error.message
    );
    console.error("[TMDB-MULTI DEBUG] Full error:", {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      config: {
        url: error?.config?.url,
        params: error?.config?.params,
      },
    });
    throw new Error(
      "Failed to fetch movie recommendations from TMDB multi-endpoint"
    );
  }
};
