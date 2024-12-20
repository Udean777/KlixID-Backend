// Import the User model from the models directory
import { User } from "../models/user_model";

// Import the TMDB service for fetching data from the API
import { fetchFromTMDB } from "../services/tmdb_services.js";

/**
 * Search for a person using the TMDB API
 * @route GET /search/person/:query
 * @param {string} query - Search term for a person
 * @returns {Object} List of persons matching the search query
 */
export const searchPerson = async (req, res) => {
  const { query } = req.params;

  try {
    // Validate search query
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Fetch person search results from TMDB API
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(
        query
      )}&include_adult=false&language=en-US&page=1`
    );

    // Check if any results are returned
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No persons found matching the search query",
      });
    }

    try {
      // Save search details in user's search history
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          searchHistory: {
            id: data.results[0].id,
            image: data.results[0].profile_path,
            title: data.results[0].name,
            searchType: "person",
            createdAt: new Date(),
          },
        },
      });
    } catch (dbError) {
      // Log database error but don't fail the search request
      console.error("Error saving to search history:", dbError.message);
    }

    // Return search results to the client
    res.status(200).json({ success: true, data: data.results });
  } catch (error) {
    // Log the error for server-side tracking
    console.error("Error in searchPerson controller: ", error.message);

    // Handle API authentication errors
    if (error.response?.status === 401) {
      return res.status(503).json({
        success: false,
        message: "Unable to access search service. Please try again later.",
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
      message: "Search service temporarily unavailable",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Search for movies using the TMDB API
 * @route GET /search/movie/:query
 * @param {string} query - Search term for movies
 * @returns {Object} List of movies matching the search query
 */
export const searchMovies = async (req, res) => {
  const { query } = req.params;

  try {
    // Validate search query
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Fetch movie search results from TMDB API
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        query
      )}&include_adult=false&language=en-US&page=1`
    );

    // Check if any results are returned
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No movies found matching the search query",
      });
    }

    try {
      // Save search details in user's search history
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          searchHistory: {
            id: data.results[0].id,
            image: data.results[0].poster_path,
            title: data.results[0].title,
            searchType: "movie",
            createdAt: new Date(),
          },
        },
      });
    } catch (dbError) {
      // Log database error but don't fail the search request
      console.error("Error saving to search history:", dbError.message);
    }

    // Return search results to the client
    res.status(200).json({ success: true, data: data.results });
  } catch (error) {
    // Log the error for server-side tracking
    console.error("Error in searchMovie controller: ", error.message);

    // Handle API authentication errors
    if (error.response?.status === 401) {
      return res.status(503).json({
        success: false,
        message: "Unable to access search service. Please try again later.",
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
      message: "Search service temporarily unavailable",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Search for TV shows using the TMDB API
 * @route GET /search/tv/:query
 * @param {string} query - Search term for TV shows
 * @returns {Object} List of TV shows matching the search query
 */
export const searchTvShows = async (req, res) => {
  const { query } = req.params;

  try {
    // Validate search query
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Fetch TV show search results from TMDB API
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
        query
      )}&include_adult=false&language=en-US&page=1`
    );

    // Check if any results are returned
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No TV shows found matching the search query",
      });
    }

    try {
      // Save search details in user's search history
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          searchHistory: {
            id: data.results[0].id,
            image: data.results[0].poster_path,
            title: data.results[0].name,
            searchType: "tv",
            createdAt: new Date(),
          },
        },
      });
    } catch (dbError) {
      // Log database error but don't fail the search request
      console.error("Error saving to search history:", dbError.message);
    }

    // Return search results to the client
    res.status(200).json({ success: true, data: data.results });
  } catch (error) {
    // Log the error for server-side tracking
    console.error("Error in searchTv controller: ", error.message);

    // Handle API authentication errors
    if (error.response?.status === 401) {
      return res.status(503).json({
        success: false,
        message: "Unable to access search service. Please try again later.",
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
      message: "Search service temporarily unavailable",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Retrieve user's search history
 * @route GET /search-history
 * @returns {Object} User's search history
 */
export const getSearchHistory = async (req, res) => {
  try {
    // Validate user authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Return user's search history
    res.status(200).json({
      success: true,
      content: req.user.searchHistory || [],
    });
  } catch (error) {
    // Log the error for server-side tracking
    console.error("Error in getSearchHistory controller: ", error.message);

    // Handle mongoose errors
    if (error.name === "MongooseError") {
      return res.status(503).json({
        success: false,
        message: "Database service temporarily unavailable",
      });
    }

    // Handle other errors
    res.status(503).json({
      success: false,
      message: "Unable to retrieve search history. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Remove an item from user's search history
 * @route DELETE /search-history/:id
 * @param {number} id - ID of the item to remove from search history
 * @returns {Object} Confirmation of item removal
 */
export const removeItemFromSearchHistory = async (req, res) => {
  let { id } = req.params;

  try {
    // Validate ID parameter
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required",
      });
    }

    // Convert ID to integer
    id = parseInt(id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    // Validate user authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Remove the specified item from user's search history
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          searchHistory: { id: id },
        },
      },
      { new: true } // Return the updated document
    );

    // Check if the user was found and updated
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Confirm removal to the client
    res.status(200).json({
      success: true,
      message: "Item removed from search history",
    });
  } catch (error) {
    // Log the error for server-side tracking
    console.error(
      "Error in removeItemFromSearchHistory controller: ",
      error.message
    );

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid data format",
      });
    }

    // Handle mongoose errors
    if (error.name === "MongooseError") {
      return res.status(503).json({
        success: false,
        message: "Database service temporarily unavailable",
      });
    }

    // Handle other errors
    res.status(503).json({
      success: false,
      message: "Unable to remove item from history. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
