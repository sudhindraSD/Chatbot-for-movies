import { User } from "../models/user.model.js";
import { UserPreferences } from "../models/UserPreferences.js";
import { MovieHistory } from "../models/MovieHistory.js";
import { getMovieRecommendations } from "../utils/groqMovieService.js";
import { getMovieTrailer } from "../utils/tmdbService.js";
import { getMultiEndpointMovies } from "../utils/tmdbMultiEndpoint.js";

/**
 * Get movie recommendations for the user, using explicit query or saved defaults.
 *
 * @route   GET /api/v1/movies/recommendations
 * @access  Private
 */
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user?._id;
    let { genre, length, rating, page } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Get preferences if query params are missing
    if (!genre || !length || !rating) {
      const prefs = await UserPreferences.findOne({ userId });

      genre = genre || prefs?.favoriteGenres?.[0] || "action";
      length = length || prefs?.avgMovieLength || "any";
      rating = rating || prefs?.ageRating || "any";
    }

    console.log(
      `[Movies] Getting recommendations from TMDB multi-endpoint: genre=${genre}, length=${length}, rating=${rating}, mood=${req.query.mood}`
    );

    // Get movies from TMDB multi-endpoint strategy (16 parallel requests)
    let movies = [];
    try {
      movies = await getMultiEndpointMovies({
        genre,
        length,
        rating,
        mood: req.query.mood,
      });
      console.log(
        `[Movies] TMDB multi-endpoint returned ${movies.length} movies`
      );
    } catch (tmdbError) {
      console.error(
        "[Movies] TMDB multi-endpoint failed, using fallback movies:",
        tmdbError.message
      );
      // Fallback: Return curated movies if TMDB fails
      movies = getFallbackMovies(genre);
    }

    if (!movies || movies.length === 0) {
      console.warn("[Movies] No movies returned, using fallback");
      movies = getFallbackMovies(genre);
    }

    return res.status(200).json({
      success: true,
      movies,
    });
  } catch (error) {
    console.error("[Movies] Error getting recommendations:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to get movie recommendations",
      error: error.message,
    });
  }
};

// Fallback movies when TMDB API is unavailable
function getFallbackMovies(genre = "action") {
  const fallbackMoviesByGenre = {
    action: [
      {
        id: 1,
        title: "The Dark Knight",
        poster: null,
        rating: 9.0,
        overview: "Batman faces the Joker in this epic thriller.",
        releaseYear: 2008,
      },
      {
        id: 2,
        title: "Mad Max: Fury Road",
        poster: null,
        rating: 8.1,
        overview: "A post-apocalyptic action adventure.",
        releaseYear: 2015,
      },
      {
        id: 3,
        title: "John Wick",
        poster: null,
        rating: 7.4,
        overview: "An ex-hitman seeks vengeance.",
        releaseYear: 2014,
      },
      {
        id: 4,
        title: "Inception",
        poster: null,
        rating: 8.8,
        overview: "A thief steals secrets through dreams.",
        releaseYear: 2010,
      },
      {
        id: 5,
        title: "Mission: Impossible",
        poster: null,
        rating: 7.1,
        overview: "Ethan Hunt takes on impossible missions.",
        releaseYear: 1996,
      },
      {
        id: 6,
        title: "Die Hard",
        poster: null,
        rating: 8.2,
        overview: "A cop battles terrorists in a skyscraper.",
        releaseYear: 1988,
      },
      {
        id: 7,
        title: "The Matrix",
        poster: null,
        rating: 8.7,
        overview: "A hacker discovers reality is simulated.",
        releaseYear: 1999,
      },
      {
        id: 8,
        title: "Gladiator",
        poster: null,
        rating: 8.5,
        overview: "A general becomes a gladiator seeking revenge.",
        releaseYear: 2000,
      },
      {
        id: 9,
        title: "Casino Royale",
        poster: null,
        rating: 8.0,
        overview: "James Bond's first mission as 007.",
        releaseYear: 2006,
      },
      {
        id: 10,
        title: "The Bourne Identity",
        poster: null,
        rating: 7.9,
        overview: "An amnesiac spy uncovers his past.",
        releaseYear: 2002,
      },
      {
        id: 11,
        title: "Kill Bill Vol. 1",
        poster: null,
        rating: 8.1,
        overview: "A bride seeks revenge on her assassins.",
        releaseYear: 2003,
      },
      {
        id: 12,
        title: "The Raid",
        poster: null,
        rating: 7.6,
        overview: "SWAT team trapped in a crime lord's building.",
        releaseYear: 2011,
      },
      {
        id: 13,
        title: "Terminator 2",
        poster: null,
        rating: 8.5,
        overview: "A cyborg protects a boy from the future.",
        releaseYear: 1991,
      },
      {
        id: 14,
        title: "Speed",
        poster: null,
        rating: 7.2,
        overview: "A bus rigged to explode if it slows down.",
        releaseYear: 1994,
      },
      {
        id: 15,
        title: "Top Gun: Maverick",
        poster: null,
        rating: 8.3,
        overview: "An elite pilot trains a new generation.",
        releaseYear: 2022,
      },
      {
        id: 16,
        title: "Extraction",
        poster: null,
        rating: 6.7,
        overview: "A mercenary rescues a kidnapped boy.",
        releaseYear: 2020,
      },
      {
        id: 17,
        title: "Edge of Tomorrow",
        poster: null,
        rating: 7.9,
        overview: "A soldier relives his last day in a time loop.",
        releaseYear: 2014,
      },
      {
        id: 18,
        title: "RRR",
        poster: null,
        rating: 7.9,
        overview: "Two revolutionaries fight British rule in India.",
        releaseYear: 2022,
      },
      {
        id: 19,
        title: "Fury",
        poster: null,
        rating: 7.6,
        overview: "A tank crew battles through Nazi Germany.",
        releaseYear: 2014,
      },
      {
        id: 20,
        title: "The Raid 2",
        poster: null,
        rating: 7.9,
        overview: "An undercover cop infiltrates a crime syndicate.",
        releaseYear: 2014,
      },
    ],
    comedy: [
      {
        id: 21,
        title: "The Grand Budapest Hotel",
        poster: null,
        rating: 8.1,
        overview: "A quirky comedy about a hotel concierge.",
        releaseYear: 2014,
      },
      {
        id: 22,
        title: "Superbad",
        poster: null,
        rating: 7.6,
        overview: "Two high school friends have one wild night.",
        releaseYear: 2007,
      },
      {
        id: 23,
        title: "The Hangover",
        poster: null,
        rating: 7.7,
        overview: "Friends wake up with no memory of the night.",
        releaseYear: 2009,
      },
      {
        id: 24,
        title: "Bridesmaids",
        poster: null,
        rating: 6.8,
        overview: "Wedding chaos ensues.",
        releaseYear: 2011,
      },
      {
        id: 25,
        title: "Deadpool",
        poster: null,
        rating: 8.0,
        overview: "A wisecracking mercenary gets superpowers.",
        releaseYear: 2016,
      },
      {
        id: 26,
        title: "Groundhog Day",
        poster: null,
        rating: 8.0,
        overview: "A weatherman relives the same day repeatedly.",
        releaseYear: 1993,
      },
      {
        id: 27,
        title: "Dumb and Dumber",
        poster: null,
        rating: 7.3,
        overview: "Two dim-witted friends go on a cross-country trip.",
        releaseYear: 1994,
      },
      {
        id: 28,
        title: "Step Brothers",
        poster: null,
        rating: 6.9,
        overview: "Two grown men become stepbrothers.",
        releaseYear: 2008,
      },
      {
        id: 29,
        title: "Anchorman",
        poster: null,
        rating: 7.2,
        overview: "A 1970s news anchor faces a changing world.",
        releaseYear: 2004,
      },
      {
        id: 30,
        title: "21 Jump Street",
        poster: null,
        rating: 7.2,
        overview: "Two cops go undercover in high school.",
        releaseYear: 2012,
      },
      {
        id: 31,
        title: "Shaun of the Dead",
        poster: null,
        rating: 7.9,
        overview: "A man fights zombies to save his ex.",
        releaseYear: 2004,
      },
      {
        id: 32,
        title: "Hot Fuzz",
        poster: null,
        rating: 7.8,
        overview: "A top cop is transferred to a sleepy village.",
        releaseYear: 2007,
      },
      {
        id: 33,
        title: "Tropic Thunder",
        poster: null,
        rating: 7.0,
        overview: "Actors filming a war movie get caught in real combat.",
        releaseYear: 2008,
      },
      {
        id: 34,
        title: "Borat",
        poster: null,
        rating: 7.3,
        overview: "A Kazakh journalist explores America.",
        releaseYear: 2006,
      },
      {
        id: 35,
        title: "Airplane!",
        poster: null,
        rating: 7.7,
        overview: "A spoof of disaster movies.",
        releaseYear: 1980,
      },
      {
        id: 36,
        title: "The Big Lebowski",
        poster: null,
        rating: 8.1,
        overview: "A slacker gets caught in a kidnapping plot.",
        releaseYear: 1998,
      },
      {
        id: 37,
        title: "Knives Out",
        poster: null,
        rating: 7.9,
        overview: "A detective investigates a mysterious death.",
        releaseYear: 2019,
      },
      {
        id: 38,
        title: "Jojo Rabbit",
        poster: null,
        rating: 7.9,
        overview: "A boy's imaginary friend is Hitler.",
        releaseYear: 2019,
      },
      {
        id: 39,
        title: "Palm Springs",
        poster: null,
        rating: 7.4,
        overview: "Two wedding guests stuck in a time loop.",
        releaseYear: 2020,
      },
      {
        id: 40,
        title: "Game Night",
        poster: null,
        rating: 6.9,
        overview: "A game night turns into a real mystery.",
        releaseYear: 2018,
      },
    ],
    horror: [
      {
        id: 41,
        title: "Get Out",
        poster: null,
        rating: 7.7,
        overview:
          "A man uncovers dark secrets at his girlfriend's family estate.",
        releaseYear: 2017,
      },
      {
        id: 42,
        title: "A Quiet Place",
        poster: null,
        rating: 7.5,
        overview: "Silence is survival in this thriller.",
        releaseYear: 2018,
      },
      {
        id: 43,
        title: "The Conjuring",
        poster: null,
        rating: 7.5,
        overview: "Paranormal investigators face demonic forces.",
        releaseYear: 2013,
      },
      {
        id: 44,
        title: "Hereditary",
        poster: null,
        rating: 7.3,
        overview: "A family haunted by dark secrets.",
        releaseYear: 2018,
      },
      {
        id: 45,
        title: "It",
        poster: null,
        rating: 7.3,
        overview: "Kids face their fears against a killer clown.",
        releaseYear: 2017,
      },
      {
        id: 46,
        title: "The Shining",
        poster: null,
        rating: 8.4,
        overview: "A family is terrorized by supernatural forces.",
        releaseYear: 1980,
      },
      {
        id: 47,
        title: "The Exorcist",
        poster: null,
        rating: 8.0,
        overview: "A young girl possessed by a demon.",
        releaseYear: 1973,
      },
      {
        id: 48,
        title: "Midsommar",
        poster: null,
        rating: 7.1,
        overview: "A couple attends a Swedish festival with dark secrets.",
        releaseYear: 2019,
      },
      {
        id: 49,
        title: "The Witch",
        poster: null,
        rating: 6.9,
        overview: "A family in 1630s New England faces evil.",
        releaseYear: 2015,
      },
      {
        id: 50,
        title: "Sinister",
        poster: null,
        rating: 6.8,
        overview: "A writer finds disturbing home movies.",
        releaseYear: 2012,
      },
      {
        id: 51,
        title: "The Ring",
        poster: null,
        rating: 7.1,
        overview: "A cursed videotape kills viewers in seven days.",
        releaseYear: 2002,
      },
      {
        id: 52,
        title: "28 Days Later",
        poster: null,
        rating: 7.6,
        overview: "A man wakes to find the world infected.",
        releaseYear: 2002,
      },
      {
        id: 53,
        title: "The Descent",
        poster: null,
        rating: 7.2,
        overview: "Spelunkers encounter creatures underground.",
        releaseYear: 2005,
      },
      {
        id: 54,
        title: "Insidious",
        poster: null,
        rating: 6.8,
        overview: "A family haunted by a dark entity.",
        releaseYear: 2010,
      },
      {
        id: 55,
        title: "Us",
        poster: null,
        rating: 6.8,
        overview: "A family confronted by their doppelgangers.",
        releaseYear: 2019,
      },
      {
        id: 56,
        title: "Train to Busan",
        poster: null,
        rating: 7.6,
        overview: "Passengers fight zombies on a speeding train.",
        releaseYear: 2016,
      },
      {
        id: 57,
        title: "The Cabin in the Woods",
        poster: null,
        rating: 7.0,
        overview: "College students face more than expected.",
        releaseYear: 2011,
      },
      {
        id: 58,
        title: "Evil Dead",
        poster: null,
        rating: 6.5,
        overview: "Friends unleash demonic forces.",
        releaseYear: 2013,
      },
      {
        id: 59,
        title: "Don't Breathe",
        poster: null,
        rating: 7.1,
        overview: "Burglars target a blind man's home.",
        releaseYear: 2016,
      },
      {
        id: 60,
        title: "Scream",
        poster: null,
        rating: 7.3,
        overview: "A masked killer terrorizes a small town.",
        releaseYear: 1996,
      },
    ],
    drama: [
      {
        id: 61,
        title: "The Shawshank Redemption",
        poster: null,
        rating: 9.3,
        overview: "Hope finds a way even in prison.",
        releaseYear: 1994,
      },
      {
        id: 62,
        title: "Forrest Gump",
        poster: null,
        rating: 8.8,
        overview: "Life is like a box of chocolates.",
        releaseYear: 1994,
      },
      {
        id: 63,
        title: "The Godfather",
        poster: null,
        rating: 9.2,
        overview: "A mafia family's saga.",
        releaseYear: 1972,
      },
      {
        id: 64,
        title: "Schindler's List",
        poster: null,
        rating: 8.9,
        overview: "One man's mission to save lives.",
        releaseYear: 1993,
      },
      {
        id: 65,
        title: "12 Years a Slave",
        poster: null,
        rating: 8.1,
        overview: "A harrowing tale of survival.",
        releaseYear: 2013,
      },
      {
        id: 66,
        title: "Parasite",
        poster: null,
        rating: 8.5,
        overview: "A poor family schemes to work for a wealthy household.",
        releaseYear: 2019,
      },
      {
        id: 67,
        title: "Whiplash",
        poster: null,
        rating: 8.5,
        overview: "A drummer pushed to his limits.",
        releaseYear: 2014,
      },
      {
        id: 68,
        title: "The Green Mile",
        poster: null,
        rating: 8.6,
        overview: "A death row guard befriends a gentle giant.",
        releaseYear: 1999,
      },
      {
        id: 69,
        title: "Good Will Hunting",
        poster: null,
        rating: 8.3,
        overview: "A janitor is a genius mathematician.",
        releaseYear: 1997,
      },
      {
        id: 70,
        title: "The Pianist",
        poster: null,
        rating: 8.5,
        overview: "A Jewish pianist survives WWII.",
        releaseYear: 2002,
      },
      {
        id: 71,
        title: "Moonlight",
        poster: null,
        rating: 7.4,
        overview: "A young man's journey to self-discovery.",
        releaseYear: 2016,
      },
      {
        id: 72,
        title: "Manchester by the Sea",
        poster: null,
        rating: 7.8,
        overview: "A janitor confronts his past.",
        releaseYear: 2016,
      },
      {
        id: 73,
        title: "A Beautiful Mind",
        poster: null,
        rating: 8.2,
        overview: "A mathematician battles schizophrenia.",
        releaseYear: 2001,
      },
      {
        id: 74,
        title: "The Pursuit of Happyness",
        poster: null,
        rating: 8.0,
        overview: "A father fights homelessness for his son.",
        releaseYear: 2006,
      },
      {
        id: 75,
        title: "Room",
        poster: null,
        rating: 8.1,
        overview: "A woman and her son escape captivity.",
        releaseYear: 2015,
      },
      {
        id: 76,
        title: "The Revenant",
        poster: null,
        rating: 8.0,
        overview: "A frontiersman survives and seeks revenge.",
        releaseYear: 2015,
      },
      {
        id: 77,
        title: "Spotlight",
        poster: null,
        rating: 8.1,
        overview: "Journalists uncover abuse in the Catholic Church.",
        releaseYear: 2015,
      },
      {
        id: 78,
        title: "American Beauty",
        poster: null,
        rating: 8.3,
        overview: "A man's midlife crisis spirals.",
        releaseYear: 1999,
      },
      {
        id: 79,
        title: "The Social Network",
        poster: null,
        rating: 7.8,
        overview: "The founding of Facebook.",
        releaseYear: 2010,
      },
      {
        id: 80,
        title: "Her",
        poster: null,
        rating: 8.0,
        overview: "A man falls for an AI.",
        releaseYear: 2013,
      },
    ],
  };

  const movies =
    fallbackMoviesByGenre[genre.toLowerCase()] || fallbackMoviesByGenre.action;
  return movies.slice(0, 20);
}

/**
 * Record that a user picked a movie and update their stats/preferences.
 *
 * @route   POST /api/v1/movies/pick
 * @access  Private
 */
export const pickMovie = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { movieId, movieTitle, moviePoster, genre, mood } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!movieId || !movieTitle) {
      return res.status(400).json({
        success: false,
        message: "movieId and movieTitle are required",
      });
    }

    // Create history entry
    await MovieHistory.create({
      userId,
      movieId,
      movieTitle,
      moviePoster: moviePoster || null,
      genre: genre || null,
      mood: mood || null,
    });

    // Update or create preferences
    let prefs = await UserPreferences.findOne({ userId });

    if (!prefs) {
      prefs = await UserPreferences.create({
        userId,
        favoriteGenres: genre ? [genre] : [],
      });
    } else if (genre && !prefs.favoriteGenres.includes(genre)) {
      prefs.favoriteGenres.push(genre);
      await prefs.save();
    }

    // Update user stats: increment totalMoviesPicked, mark as returning user
    const user = await User.findById(userId);
    if (user) {
      user.totalMoviesPicked = (user.totalMoviesPicked || 0) + 1;
      user.isNewUser = false;
      await user.save({ validateBeforeSave: false });
    }

    // Hot take generator (simple random pick from list)
    const hotTakes = [
      "Solid choice. Criterion Collection approved 🎬",
      "A cultured pick. Scorsese would be proud 🎥",
      "Classic. Roger Ebert gives it two thumbs up 👍👍",
      "Bold move. Tarantino-level taste detected 🔥",
      "Immaculate vibes. Kubrick energy 🧠",
    ];

    const hotTake = hotTakes[Math.floor(Math.random() * hotTakes.length)];

    return res.status(200).json({
      success: true,
      message: "Movie picked and saved",
      hotTake,
    });
  } catch (error) {
    console.error("[Movies] Error picking movie:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to save picked movie",
      error: error.message,
    });
  }
};

/**
 * Get the last 5 picked movies for a user (Rewind feature).
 *
 * @route   GET /api/v1/movies/history/:userId?
 * @access  Private
 */
export const getHistory = async (req, res) => {
  try {
    const paramUserId = req.params.userId;
    const authUserId = req.user?._id;
    const userId = paramUserId || authUserId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const history = await MovieHistory.find({ userId })
      .sort({ pickedAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("[Movies] Error getting history:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to get movie history",
      error: error.message,
    });
  }
};

/**
 * Get trailer URL for a movie.
 *
 * @route   GET /api/v1/movies/trailer/:movieId
 * @access  Private
 */
export const getTrailer = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: "movieId parameter is required",
      });
    }

    const trailerUrl = await getMovieTrailer(movieId);

    return res.status(200).json({
      success: true,
      trailerUrl,
    });
  } catch (error) {
    console.error("[Movies] Error getting trailer:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to get movie trailer",
      error: error.message,
    });
  }
};

/**
 * Get user stats for dashboard (total picks, current streak, favorite genres, new/returning).
 *
 * @route   GET /api/v1/movies/stats/:userId?
 * @access  Private
 */
export const getUserStats = async (req, res) => {
  try {
    const paramUserId = req.params.userId;
    const authUserId = req.user?._id;
    const userId = paramUserId || authUserId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = await User.findById(userId);
    const prefs = await UserPreferences.findOne({ userId });
    const totalHistory = await MovieHistory.countDocuments({ userId });

    const stats = {
      totalMoviesPicked: user?.totalMoviesPicked ?? totalHistory ?? 0,
      currentStreak: prefs?.moodStreak || null,
      favoriteGenres: prefs?.favoriteGenres || [],
      isNewUser: user?.isNewUser ?? true,
    };

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("[Movies] Error getting user stats:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to get user stats",
      error: error.message,
    });
  }
};

/**
 * Clear user's entire movie history
 * THIS CANNOT BE UNDONE - use with caution!
 *
 * @route   DELETE /api/v1/movies/history
 * @access  Private
 */
export const clearHistory = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Delete all movie history for this user
    const result = await MovieHistory.deleteMany({ userId });

    console.log(
      `[Movies] Cleared ${result.deletedCount} history entries for user ${userId}`
    );

    // Reset user's total movie count
    await User.findByIdAndUpdate(userId, {
      totalMoviesPicked: 0,
    });

    return res.status(200).json({
      success: true,
      message: "History cleared successfully! Fresh start 🎬",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("[Movies] Error clearing history:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to clear history",
      error: error.message,
    });
  }
};

/**
 * TEST ENDPOINT: Get movies using the new multi-endpoint TMDB strategy.
 * This endpoint is for testing the 16-endpoint parallel TMDB approach before production.
 *
 * @route   POST /api/v1/movies/test-tmdb
 * @access  Private
 */
export const testTmdbMultiEndpoint = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { genre, length, rating } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    console.log(
      `[Movies TEST] Testing multi-endpoint TMDB: genre=${genre}, length=${length}, rating=${rating}`
    );

    // Get movies from multi-endpoint TMDB strategy
    const movies = await getMultiEndpointMovies({
      genre,
      length,
      rating,
    });

    console.log(
      `[Movies TEST] Multi-endpoint TMDB returned ${movies.length} movies`
    );

    return res.status(200).json({
      success: true,
      movies,
      count: movies.length,
      message: `Multi-endpoint TMDB test successful! Retrieved ${movies.length} unique movies from 16 parallel TMDB endpoints.`,
    });
  } catch (error) {
    console.error(
      "[Movies TEST] Error testing multi-endpoint TMDB:",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Failed to test multi-endpoint TMDB",
      error: error.message,
    });
  }
};
