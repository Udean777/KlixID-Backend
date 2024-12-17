// Import the TMDB service function for fetching movie data from The Movie Database API
import { fetchFromTMDB } from "../services/tmdb_services.js";

/**
 * Retrieve the top 5 trending movies for the day
 * @route GET /trending-movies
 * @returns {Object} List of top 5 trending movies
 */
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
  } catch (error) {
    // Log the error for server-side tracking
    console.error(`Error in getTrendingMovies controller: ${error.message}`);

    // Return a 500 Internal Server Error
    res.status(500).json({
      success: false,
      message: "Failed to fetch trending movies",
      error: error.message,
    });
  }
};

/**
 * Retrieve movies currently playing in theaters
 * @route GET /now-playing
 * @returns {Object} List of movies currently in theaters
 */
export const getNowPlayingMovies = async (req, res) => {
  try {
    // Fetch movies currently in theaters from TMDB API
    const data = await fetchFromTMDB(
      "https://api.themoviedb.org/3/movie/now_playing"
    );

    // Check if any movies are returned
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No movies currently playing",
      });
    }

    // Send the list of now playing movies
    res.status(200).json({ success: true, data: data.results });
  } catch (error) {
    // Log the error for server-side tracking
    console.error(`Error in getNowPlayingMovies controller: ${error.message}`);

    // Return a 500 Internal Server Error
    res.status(500).json({
      success: false,
      message: "Failed to fetch now playing movies",
      error: error.message,
    });
  }
};

/**
 * Retrieve the trailer for a specific movie
 * @route GET /movie/:id/trailer
 * @param {string} id - Movie ID
 * @returns {Object} First available trailer for the movie
 */
export const getMovieTrailer = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch video information for the specified movie
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`
    );

    // Check if any trailers are available
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No trailers found for this movie",
      });
    }

    // Send the first available trailer
    res.status(200).json({ success: true, trailer: data.results[0] });
  } catch (error) {
    // Log the error for server-side tracking
    console.error(`Error in getMovieTrailer controller: ${error.message}`);

    // Handle specific error cases
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Return a 500 Internal Server Error for other errors
    res.status(500).json({
      success: false,
      message: "Failed to fetch movie trailer",
      error: error.message,
    });
  }
};

/**
 * Retrieve detailed information about a specific movie
 * @route GET /movie/:id
 * @param {string} id - Movie ID
 * @returns {Object} Comprehensive details of the movie
 */
export const getMovieDetails = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch comprehensive details for the specified movie
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}?language=en-US`
    );

    // Send the movie details with a success status
    res.status(200).json({ success: true, data });
  } catch (error) {
    // Log the error for server-side tracking
    console.error(`Error in getMovieDetails controller: ${error.message}`);

    // Handle specific error cases
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Return a 500 Internal Server Error for other errors
    res.status(500).json({
      success: false,
      message: "Failed to fetch movie details",
      error: error.message,
    });
  }
};

/**
 * Retrieve movies similar to a specific movie
 * @route GET /movie/:id/similar
 * @param {string} id - Movie ID
 * @returns {Object} List of similar movies
 */
export const getSimilarMovies = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch a list of movies similar to the specified movie
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`
    );

    // Check if any similar movies are found
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No similar movies found",
      });
    }

    // Send the list of similar movies
    res.status(200).json({ success: true, data: data.results });
  } catch (error) {
    // Log the error for server-side tracking
    console.error(`Error in getSimilarMovies controller: ${error.message}`);

    // Return a 500 Internal Server Error
    res.status(500).json({
      success: false,
      message: "Failed to fetch similar movies",
      error: error.message,
    });
  }
};

/**
 * Retrieve movie recommendations based on a specific movie
 * @route GET /movie/:id/recommendations
 * @param {string} id - Movie ID
 * @returns {Object} List of recommended movies
 */
export const getRecommendationMovies = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch movie recommendations based on the specified movie
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1`
    );

    // Check if any recommendations are found
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No movie recommendations found",
      });
    }

    // Send the list of recommended movies
    res.status(200).json({ success: true, data: data.results });
  } catch (error) {
    // Log the error for server-side tracking
    console.error(
      `Error in getRecommendationMovies controller: ${error.message}`
    );

    // Return a 500 Internal Server Error
    res.status(500).json({
      success: false,
      message: "Failed to fetch movie recommendations",
      error: error.message,
    });
  }
};

/**
 * Retrieve movies by a specific category
 * @route GET /movies/:category
 * @param {string} category - Movie category (e.g., popular, top_rated, upcoming)
 * @returns {Object} List of movies in the specified category
 */
export const getMoviesByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    // Fetch movies for the specified category
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`
    );

    // Check if any movies are found in the category
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No movies found in category: ${category}`,
      });
    }

    // Send the list of movies in the specified category
    res.status(200).json({ success: true, data: data.results });
  } catch (error) {
    // Log the error for server-side tracking
    console.error(`Error in getMoviesByCategory controller: ${error.message}`);

    // Return a 500 Internal Server Error
    res.status(500).json({
      success: false,
      message: `Failed to fetch movies in category: ${category}`,
      error: error.message,
    });
  }
};
