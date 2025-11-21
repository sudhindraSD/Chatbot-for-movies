import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Loader2 } from "lucide-react";
import CinematicLoader from "../components/ui/CinematicLoader";
import MovieCarousel from "../components/movies/MovieCarousel";
import Navigation from "../components/layout/Navigation";
import * as movieService from "../services/movieService";
import toast from "react-hot-toast";

/**
 * MoviesPage - INFINITE MOVIE CAROUSEL
 * Fetches movies based on SELECTED MOODS (100 per mood)
 * User sees smooth infinite scrolling and picks one
 */

const MoviesPage = () => {
  const navigate = useNavigate();
  const { selectedMoods, setMovies } = useApp();
  const [movies, setLocalMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch movies based on selected moods
  useEffect(() => {
    const fetchMoviesForMoods = async () => {
      if (!selectedMoods || selectedMoods.length === 0) {
        toast.error("No moods selected! Please go back and select moods.");
        navigate("/mood");
        return;
      }

      setLoading(true);
      try {
        console.log("[MoviesPage] Fetching movies for moods:", selectedMoods);

        // Fetch movies for EACH mood (100 per mood)
        const allMoviesPromises = selectedMoods.map((mood) =>
          movieService.getRecommendations({ genre: mood, mood })
        );

        const moviesArrays = await Promise.all(allMoviesPromises);

        // Combine all movies from different moods
        let combinedMovies = moviesArrays.flatMap(
          (response) => response.movies || []
        );

        console.log(
          `[MoviesPage] Fetched ${combinedMovies.length} total movies from ${selectedMoods.length} moods`
        );

        if (combinedMovies.length === 0) {
          throw new Error("No movies found for selected moods");
        }

        // DEDUPLICATE by ID
        combinedMovies = Array.from(
          new Map(combinedMovies.map((m) => [m.id, m])).values()
        );

        // SHUFFLE thoroughly (Fisher-Yates)
        for (let i = combinedMovies.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [combinedMovies[i], combinedMovies[j]] = [
            combinedMovies[j],
            combinedMovies[i],
          ];
        }

        setLocalMovies(combinedMovies);
        setMovies(combinedMovies); // Save to context too
        toast.success(
          `Found ${combinedMovies.length} movies across ${selectedMoods.join(
            ", "
          )}! 🎬`
        );
        setLoading(false);
      } catch (error) {
        console.error("[MoviesPage] Error fetching movies:", error);
        toast.error("Failed to load movies. Please try again!");
        setLoading(false);
      }
    };

    fetchMoviesForMoods();
  }, [selectedMoods]);

  const handleMoviePicked = async (movie) => {
    try {
      console.log("[MoviesPage] Picking movie:", movie);
      const response = await movieService.pickMovie({
        movieId: movie.id,
        movieTitle: movie.title,
        moviePoster: movie.poster,
        genre: selectedMoods?.[0] || "action",
        mood: selectedMoods?.join(", ") || "chill",
      });

      // Show the bot's hot take
      toast.success(response.hotTake, {
        duration: 4000,
        icon: "🎬",
        style: {
          background: "#1f2937",
          color: "#fff",
          border: "2px solid #a855f7",
        },
      });

      // Navigate to history after a delay
      setTimeout(() => {
        navigate("/history");
      }, 3000);
    } catch (error) {
      toast.error("Failed to save movie");
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
          <CinematicLoader
            text={`Curating ${selectedMoods?.length > 0 ? selectedMoods.join(" & ") : ""} movies...`}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <MovieCarousel movies={movies} onMoviePicked={handleMoviePicked} />
    </>
  );
};

export default MoviesPage;
