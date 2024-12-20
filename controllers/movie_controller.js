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

    // Handle API authentication errors
    if (error.response?.status === 401) {
      return res.status(503).json({
        success: false,
        message: "Unable to access movie service. Please try again later.",
      });
    }

    // Handle rate limiting errors
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      });
    }

    // Handle service availability errors
    res.status(503).json({
      success: false,
      message: "Movie service temporarily unavailable",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
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

    // Handle API authentication errors
    if (error.response?.status === 401) {
      return res.status(503).json({
        success: false,
        message: "Unable to access movie service. Please try again later.",
      });
    }

    // Handle rate limiting errors
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      });
    }

    // Handle service availability errors
    res.status(503).json({
      success: false,
      message: "Movie service temporarily unavailable",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
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
    // Validate movie ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Movie ID is required",
      });
    }

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

    // Handle invalid movie ID
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Handle API authentication errors
    if (error.response?.status === 401) {
      return res.status(503).json({
        success: false,
        message: "Unable to access movie service. Please try again later.",
      });
    }

    // Handle rate limiting errors
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      });
    }

    // Handle service availability errors
    res.status(503).json({
      success: false,
      message: "Unable to fetch movie trailer. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
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
    // Validate movie ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Movie ID is required",
      });
    }

    // Fetch comprehensive details for the specified movie
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}?language=en-US`
    );

    // Send the movie details with a success status
    res.status(200).json({ success: true, data });
  } catch (error) {
    // Log the error for server-side tracking
    console.error(`Error in getMovieDetails controller: ${error.message}`);

    // Handle invalid movie ID
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Handle API authentication errors
    if (error.response?.status === 401) {
      return res.status(503).json({
        success: false,
        message: "Unable to access movie service. Please try again later.",
      });
    }

    // Handle rate limiting errors
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      });
    }

    // Handle service availability errors
    res.status(503).json({
      success: false,
      message: "Unable to fetch movie details. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
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
    // Validate movie ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Movie ID is required",
      });
    }

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

    // Handle invalid movie ID
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Handle API authentication errors
    if (error.response?.status === 401) {
      return res.status(503).json({
        success: false,
        message: "Unable to access movie service. Please try again later.",
      });
    }

    // Handle rate limiting errors
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      });
    }

    // Handle service availability errors
    res.status(503).json({
      success: false,
      message: "Unable to fetch similar movies. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
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
    // Validate movie ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Movie ID is required",
      });
    }

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

    // Handle invalid movie ID
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Handle API authentication errors
    if (error.response?.status === 401) {
      return res.status(503).json({
        success: false,
        message: "Unable to access movie service. Please try again later.",
      });
    }

    // Handle rate limiting errors
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      });
    }

    // Handle service availability errors
    res.status(503).json({
      success: false,
      message: "Unable to fetch movie recommendations. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
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
    // Validate category parameter
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category parameter is required",
      });
    }

    // Validate category value
    const validCategories = ["popular", "top_rated", "upcoming", "now_playing"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid category. Must be one of: popular, top_rated, upcoming, now_playing",
      });
    }

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

    // Handle API authentication errors
    if (error.response?.status === 401) {
      return res.status(503).json({
        success: false,
        message: "Unable to access movie service. Please try again later.",
      });
    }

    // Handle rate limiting errors
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      });
    }

    // Handle service availability errors
    res.status(503).json({
      success: false,
      message: `Unable to fetch movies in category: ${category}. Please try again later.`,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
