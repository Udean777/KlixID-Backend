// Import the TMDB service function for fetching movie data from The Movie Database API
import { fetchFromTMDB } from "../services/tmdb_services.js";

/**
 * Get a random trending TV show for the day
 * @route GET /trending-tv
 * @returns {Object} A random trending TV show
 */
export const getTrendingTv = async (req, res) => {
  try {
    // Fetch trending TV shows for the day
    const data = await fetchFromTMDB(
      "https://api.themoviedb.org/3/trending/tv/day?language=en-US"
    );

    // Check if we have valid results
    if (!data.results || data.results.length === 0) {
      // Return 404 if no trending shows are found
      // This is better than 500 as it indicates the resource wasn't found rather than a server error
      return res.status(404).json({
        success: false,
        message: "No trending TV shows found at the moment",
      });
    }

    // Select a random TV show from the results
    const randomMovie =
      data.results[Math.floor(Math.random() * data.results.length)];

    // Return the random TV show
    res.json({ success: true, data: randomMovie });
  } catch (error) {
    // Log the error for server-side tracking
    console.error("Error fetching trending TV shows:", error);

    // Handle different types of errors with appropriate status codes
    // 401 - Unauthorized (e.g., invalid API key)
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access to TMDB API",
        error: "Invalid API credentials",
      });
    }

    // 429 - Too Many Requests (Rate limiting)
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Too many requests to TMDB API",
        error: "Rate limit exceeded",
      });
    }

    // 503 - Service Unavailable (TMDB API is down)
    if (error.response?.status === 503) {
      return res.status(503).json({
        success: false,
        message: "TMDB service is currently unavailable",
        error: "External service unavailable",
      });
    }

    // 500 - Internal Server Error (for unexpected errors)
    res.status(500).json({
      success: false,
      message: "Failed to fetch trending TV shows",
      error: error.message,
    });
  }
};

/**
 * Get a list of popular TV shows
 * @route GET /popular-tv
 * @returns {Object} List of popular TV shows
 */
export const getPopularTv = async (req, res) => {
  try {
    // Fetch popular TV shows
    const data = await fetchFromTMDB(
      "https://api.themoviedb.org/3/tv/popular?language=en-US&page=1"
    );

    // Check if we have valid results
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No popular TV shows found at the moment",
      });
    }

    // Return the list of popular TV shows
    res.json({ success: true, data: data.results });
  } catch (error) {
    // Log the error for server-side tracking
    console.error("Error fetching popular TV shows:", error);

    // Handle API authentication errors
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access to TMDB API",
        error: "Invalid API credentials",
      });
    }

    // Handle rate limiting
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Too many requests to TMDB API",
        error: "Rate limit exceeded",
      });
    }

    // Handle TMDB service availability
    if (error.response?.status === 503) {
      return res.status(503).json({
        success: false,
        message: "TMDB service is currently unavailable",
        error: "External service unavailable",
      });
    }

    // Handle network-related errors
    if (error.code === "ECONNREFUSED" || error.code === "ECONNABORTED") {
      return res.status(503).json({
        success: false,
        message: "Unable to connect to TMDB service",
        error: "Connection error",
      });
    }

    // Default server error
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular TV shows",
      error: error.message,
    });
  }
};

/**
 * Get trailers for a specific TV show
 * @route GET /tv/:id/trailers
 * @param {string} id - TV show ID
 * @returns {Object} First trailer for the TV show
 */
export const getTvTrailers = async (req, res) => {
  const { id } = req.params;

  // Validate TV show ID
  if (!id || isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid TV show ID provided",
    });
  }

  try {
    // Fetch trailers for the specific TV show
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`
    );

    // Check if trailers exist
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No trailers found for this TV show",
      });
    }

    // Return the first trailer
    res.json({ success: true, trailer: data.results[0] });
  } catch (error) {
    // Log the error for server-side tracking
    console.error(`Error fetching trailers for TV show ${id}:`, error);

    // Handle specific error cases
    // 404 - TV show not found
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: "TV show not found",
      });
    }

    // 401 - Unauthorized access
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access to TMDB API",
        error: "Invalid API credentials",
      });
    }

    // 429 - Rate limiting
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Too many requests to TMDB API",
        error: "Rate limit exceeded",
      });
    }

    // Default server error
    res.status(500).json({
      success: false,
      message: "Failed to fetch TV show trailers",
      error: error.message,
    });
  }
};

/**
 * Get details of a specific TV show
 * @route GET /tv/:id
 * @param {string} id - TV show ID
 * @returns {Object} Detailed information about the TV show
 */
export const getTvDetails = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch details for the specific TV show
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}?language=en-US`
    );

    // Check if tv details exist
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "TV show not found",
      });
    }

    // Return the TV show details
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    // Log the error for server-side tracking
    console.error(`Error fetching details for TV show ${id}:`, error);

    // Handle specific error cases
    // 404 - TV show not found
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: "TV show not found",
      });
    }

    // 401 - Unauthorized access
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access to TMDB API",
        error: "Invalid API credentials",
      });
    }

    // 429 - Rate limiting
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Too many requests to TMDB API",
        error: "Rate limit exceeded",
      });
    }

    // Handle specific error cases
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        message: "TV show not found",
      });
    }

    // Return a 500 Internal Server Error for other errors
    res.status(500).json({
      success: false,
      message: "Failed to fetch TV show details",
      error: error.message,
    });
  }
};

/**
 * Get similar TV shows for a specific TV show
 * @route GET /tv/:id/similar
 * @param {string} id - TV show ID
 * @returns {Object} List of similar TV shows
 */
export const getSimilarTvs = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch similar TV shows
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`
    );

    // Check if similar TV shows exist
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No similar TV shows found",
      });
    }

    // Return the list of similar TV shows
    res.status(200).json({ success: true, data: data.results });
  } catch (error) {
    // Log the error for server-side tracking
    console.error(`Error fetching similar TV shows for ${id}:`, error);

    // Handle specific error cases
    // 404 - TV show not found
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: "TV show not found",
      });
    }

    // 401 - Unauthorized access
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access to TMDB API",
        error: "Invalid API credentials",
      });
    }

    // 429 - Rate limiting
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Too many requests to TMDB API",
        error: "Rate limit exceeded",
      });
    }

    // Return a 500 Internal Server Error
    res.status(500).json({
      success: false,
      message: "Failed to fetch similar TV shows",
      error: error.message,
    });
  }
};

/**
 * Get recommended TV shows for a specific TV show
 * @route GET /tv/:id/recommendations
 * @param {string} id - TV show ID
 * @returns {Object} List of recommended TV shows
 */
export async function getRecommendationTvs(req, res) {
  const { id } = req.params;
  try {
    // Fetch recommended TV shows
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}/recommendations?language=en-US&page=1`
    );

    // Check if recommended TV shows exist
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No recommended TV shows found",
      });
    }

    // Return the list of recommended TV shows
    res.status(200).json({ success: true, data: data.results });
  } catch (error) {
    // Log the error for server-side tracking
    console.error(`Error fetching recommendations for TV show ${id}:`, error);

    // Handle specific error cases
    // 404 - TV show not found
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: "TV show not found",
      });
    }

    // 401 - Unauthorized access
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access to TMDB API",
        error: "Invalid API credentials",
      });
    }

    // 429 - Rate limiting
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Too many requests to TMDB API",
        error: "Rate limit exceeded",
      });
    }

    // Return a 500 Internal Server Error
    res.status(500).json({
      success: false,
      message: "Failed to fetch TV show recommendations",
      error: error.message,
    });
  }
}

/**
 * Get TV shows by a specific category
 * @route GET /tv/category/:category
 * @param {string} category - TV show category
 * @returns {Object} List of TV shows in the specified category
 */
export async function getTvsByCategory(req, res) {
  const { category } = req.params;
  try {
    // Fetch TV shows by category
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`
    );

    // Check if TV shows exist
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No TV shows found in the specified category",
      });
    }

    // Return the list of TV shows in the category
    res.status(200).json({ success: true, data: data.results });
  } catch (error) {
    // Log the error for server-side tracking
    console.error(`Error fetching TV shows in category ${category}:`, error);

    // Handle specific error cases
    // 404 - Category not found
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 401 - Unauthorized access
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access to TMDB API",
        error: "Invalid API credentials",
      });
    }

    // 429 - Rate limiting
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Too many requests to TMDB API",
        error: "Rate limit exceeded",
      });
    }

    // Return a 500 Internal Server Error
    res.status(500).json({
      success: false,
      message: "Failed to fetch TV shows by category",
      error: error.message,
    });
  }
}

/**
 * Get keywords for a specific TV show
 * @route GET /tv/:id/keywords
 * @param {string} id - TV show ID
 * @returns {Object} List of keywords for the TV show
 */
export async function getTvKeywords(req, res) {
  const { id } = req.params;
  try {
    // Fetch keywords for the specific TV show
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}/keywords`
    );

    // Check if keywords exist
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No keywords found for the TV show",
      });
    }

    // Return the list of keywords
    res.status(200).json({ success: true, data: data.results });
  } catch (error) {
    // Log the error for server-side tracking
    console.error(`Error fetching keywords for TV show ${id}:`, error);

    // Handle specific error cases
    // 404 - TV show not found
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: "TV show not found",
      });
    }

    // 401 - Unauthorized access
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access to TMDB API",
        error: "Invalid API credentials",
      });
    }

    // 429 - Rate limiting
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Too many requests to TMDB API",
        error: "Rate limit exceeded",
      });
    }

    // Return a 500 Internal Server Error
    res.status(500).json({
      success: false,
      message: "Failed to fetch TV show keywords",
      error: error.message,
    });
  }
}
