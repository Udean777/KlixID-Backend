// Import the TMDB service function for fetching movie data from The Movie Database API
import { fetchFromTMDB } from "../services/tmdb_services.js";

// Retrieve the top 5 trending movies for the day
// This endpoint returns currently popular movies across all media types
export const getTrendingMovies = async (req, res) => {
  try {
    // Fetch trending movies from TMDB API
    const data = await fetchFromTMDB(
      "https://api.themoviedb.org/3/trending/movie/day?language=en-US"
    );
    // Limit the results to the top 5 trending movies
    const limited = data.results.slice(0, 5);
    // Send a successful response with the limited movie data
    res.status(200).json({ success: true, data: limited });
  } catch (e) {
    // Log any errors that occur during the fetch
    console.error(`Error in getTrendingMovies controller: ${e.message}`);
    // Send an error response if something goes wrong
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Retrieve movies currently playing in theaters
export const getNowPlayingMovies = async (req, res) => {
  try {
    // Fetch movies currently in theaters from TMDB API
    const data = await fetchFromTMDB(
      "https://api.themoviedb.org/3/movie/now_playing"
    );
    // Send the list of now playing movies
    res.json({ success: true, data: data.results });
  } catch (e) {
    // Log any errors that occur during the fetch
    console.error(`Error in getNowPlayingMovies controller: ${e.message}`);
    // Send an error response if something goes wrong
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Retrieve the trailer for a specific movie by its ID
export const getMovieTrailer = async (req, res) => {
  // Extract movie ID from request parameters
  const { id } = req.params;
  try {
    // Fetch video information for the specified movie
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`
    );
    // Send the first available trailer
    res.json({ success: true, trailer: data.results[0] });
  } catch (e) {
    // Log any errors that occur during the fetch
    console.error(`Error in getPopularMovies controller: ${e.message}`);
    // Handle specific 404 (Not Found) errors
    if (error.message.includes("404")) {
      return res.status(404).send(null);
    }
    // Send a generic server error for other issues
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Retrieve detailed information about a specific movie by its ID
export const getMovieDetails = async (req, res) => {
  // Extract movie ID from request parameters
  const { id } = req.params;
  try {
    // Fetch comprehensive details for the specified movie
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}?language=en-US`
    );
    // Send the movie details with a success status
    res.status(200).json({ success: true, data });
  } catch (e) {
    // Log any errors that occur during the fetch
    console.error(`Error in getMovieDetails controller: ${e.message}`);
    // Handle specific 404 (Not Found) errors
    if (error.message.includes("404")) {
      return res.status(404).send(null);
    }
    // Send a generic server error for other issues
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Retrieve movies similar to a specific movie by its ID
export const getSimilarMovies = async (req, res) => {
  // Extract movie ID from request parameters
  const { id } = req.params;
  try {
    // Fetch a list of movies similar to the specified movie
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`
    );
    // Send the list of similar movies
    res.status(200).json({ success: true, data: data.results });
  } catch (e) {
    // Log any errors that occur during the fetch
    console.error("Error in getSimilarMovies controller", e.message);
    // Send a generic server error
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Retrieve movie recommendations based on a specific movie by its ID
export const getRecommendationMovies = async (req, res) => {
  // Extract movie ID from request parameters
  const { id } = req.params;
  try {
    // Fetch movie recommendations based on the specified movie
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1`
    );
    // Send the list of recommended movies
    res.status(200).json({ success: true, data: data.results });
  } catch (e) {
    // Log any errors that occur during the fetch
    console.error("Error in getRecommendationMovies controller", e.message);
    // Send a generic server error
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Retrieve movies by a specific category (e.g., popular, top_rated, upcoming)
export const getMoviesByCategory = async (req, res) => {
  // Extract movie category from request parameters
  const { category } = req.params;
  try {
    // Fetch movies for the specified category
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`
    );
    // Send the list of movies in the specified category
    res.status(200).json({ success: true, data: data.results });
  } catch (e) {
    // Log any errors that occur during the fetch
    console.error(`Error in getMoviesByCategory controller: ${e.message}`);
    // Send a generic server error
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
