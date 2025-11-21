import axios from "axios";

/**
 * groqMovieService.js - Pure Groq AI Movie Generation
 * --------------
 * Uses Groq to generate realistic movie recommendations
 * No external APIs needed - everything from AI
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Map MOODS to GENRES
const MOOD_TO_GENRE_MAP = {
  energetic: "action",
  chill: "comedy",
  emotional: "drama",
  thrilling: "thriller",
  fun: "comedy",
  deep: "documentary",
  romantic: "romance",
  dark: "horror",
  surprise: "adventure",
};

/**
 * Generate movie recommendations using Groq AI
 */
export const getMovieRecommendations = async (options = {}) => {
  const { genre, length = "any", rating = "any", mood } = options;

  try {
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    // Map mood to genre if needed
    let targetGenre = genre;
    if ((!targetGenre || targetGenre === "any") && mood) {
      targetGenre = MOOD_TO_GENRE_MAP[mood.toLowerCase()] || "action";
      console.log(`[GROQ] Mapping mood "${mood}" to genre "${targetGenre}"`);
    }

    // Build constraints
    const lengthConstraint =
      length === "short"
        ? "under 100 minutes"
        : length === "long"
        ? "over 120 minutes"
        : "any length";

    const ratingConstraint =
      rating === "pg"
        ? "PG or PG-13 rated"
        : rating === "teen"
        ? "PG-13 to R rated"
        : rating === "mature"
        ? "R-rated or mature content"
        : "any rating";

    // Groq prompt for realistic movie generation - MASSIVE DATASET
    const prompt = `Generate exactly 100 REAL popular movies matching:

Genre: ${targetGenre || "mixed genres"}
Length: ${lengthConstraint}
Rating: ${ratingConstraint}

Requirements:
- Use REAL movie titles that exist
- Mix classics (1970-2010) with recent hits (2011-2024)
- Provide accurate plot summaries
- Realistic IMDb-style ratings (5.0-9.5)
- MAXIMUM variety within the genre - include indie films, foreign films, documentaries, cult classics
- Include lesser-known gems alongside blockbusters

Return ONLY a valid JSON array with this exact format:
[{"id":1,"title":"Actual Movie Title","overview":"Brief plot in 1-2 sentences.","rating":8.5,"releaseYear":2020,"poster":null}]

NO explanations. NO markdown. ONLY the JSON array.`;

    console.log(`[GROQ] Generating 100 ${targetGenre} movies...`);

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "llama-3.1-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a movie database API. Return ONLY valid JSON arrays of REAL movie data. No explanations, no markdown, no text outside the JSON. Generate as many movies as requested.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 1.0, // Maximum creativity for variety
        max_tokens: 8000, // Increased for 100 movies
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
      }
    );

    const content = response?.data?.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("Empty response from Groq");
    }

    console.log("[GROQ] Raw response:", content.substring(0, 200));

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = content;

    // Remove markdown code blocks if present
    jsonStr = jsonStr.replace(/```json\n?/g, "").replace(/```\n?/g, "");

    // Find JSON array
    const jsonMatch = jsonStr.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("[GROQ] Could not find JSON array in response");
      throw new Error("Invalid JSON response from Groq");
    }

    const movies = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(movies) || movies.length === 0) {
      throw new Error("Groq returned empty or invalid movie array");
    }

    console.log(`[GROQ] ✅ Successfully generated ${movies.length} movies`);
    return movies;
  } catch (error) {
    console.error("[GROQ] Error generating movies:");
    console.error("[GROQ DEBUG] Error:", error.message);
    console.error("[GROQ DEBUG] Status:", error?.response?.status);
    console.error("[GROQ DEBUG] Response:", error?.response?.data);
    throw new Error("Failed to generate movie recommendations");
  }
};
