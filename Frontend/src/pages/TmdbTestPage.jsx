import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import api from "../services/api";

const TmdbTestPage = () => {
  const [genre, setGenre] = useState("action");
  const [length, setLength] = useState("any");
  const [rating, setRating] = useState("any");
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const testTmdbMultiEndpoint = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    setMovies([]);

    try {
      const data = await api.post("/movies/test-tmdb", {
        genre,
        length,
        rating,
      });

      setMovies(data.movies || []);
      setMessage(data.message || `Retrieved ${data.count} movies`);
    } catch (err) {
      console.error("Test TMDB error:", err);
      setError(err.message || "Failed to test TMDB");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            🎬 TMDB Multi-Endpoint Test
          </h1>
          <p className="text-gray-300">
            Test the new 16-endpoint parallel TMDB strategy before production
          </p>
        </div>

        <Card className="bg-gray-800 border-gray-700 p-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="genre" className="text-white mb-2 block">
                Genre
              </Label>
              <Input
                id="genre"
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g., action, comedy, horror"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="length" className="text-white mb-2 block">
                Length
              </Label>
              <Input
                id="length"
                type="text"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="e.g., short, medium, long, any"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="rating" className="text-white mb-2 block">
                Rating
              </Label>
              <Input
                id="rating"
                type="text"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="e.g., G, PG, PG-13, R, any"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <Button
              onClick={testTmdbMultiEndpoint}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 text-lg"
            >
              {loading
                ? "Testing Multi-Endpoint TMDB..."
                : "🚀 Test Multi-Endpoint TMDB"}
            </Button>
          </div>
        </Card>

        {error && (
          <Card className="bg-red-900/50 border-red-700 p-4 mb-6">
            <p className="text-red-200">❌ {error}</p>
          </Card>
        )}

        {message && (
          <Card className="bg-green-900/50 border-green-700 p-4 mb-6">
            <p className="text-green-200">✅ {message}</p>
          </Card>
        )}

        {movies.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Results: {movies.length} movies retrieved
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {movies.map((movie, index) => (
                <Card
                  key={`${movie.id}-${index}`}
                  className="bg-gray-800 border-gray-700 p-4 hover:bg-gray-700 transition-colors"
                >
                  {movie.poster && (
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3 className="font-bold text-lg mb-1 line-clamp-2">
                    {movie.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {movie.releaseYear} • ⭐ {movie.rating?.toFixed(1) || "N/A"}
                  </p>
                  <p className="text-gray-300 text-sm line-clamp-3">
                    {movie.overview}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TmdbTestPage;
