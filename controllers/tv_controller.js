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

    // Select a random TV show from the results
    const randomMovie =
      data.results[Math.floor(Math.random() * data.results?.length)];

    // Return the random TV show
    res.json({ success: true, data: randomMovie });
  } catch (error) {
    // Log the error for server-side tracking
    console.error("Error fetching trending TV shows:", error);

    // Return a 500 Internal Server Error
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

    // Return the list of popular TV shows
    res.json({ success: true, content: data.results });
  } catch (error) {
    // Log the error for server-side tracking
    console.error("Error fetching popular TV shows:", error);

    // Return a 500 Internal Server Error
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
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        message: "TV show not found",
      });
    }

    // Return a 500 Internal Server Error for other errors
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

    // Return the TV show details
    res.status(200).json({ success: true, content: data });
  } catch (error) {
    // Log the error for server-side tracking
    console.error(`Error fetching details for TV show ${id}:`, error);

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

    // Return the list of similar TV shows
    res.status(200).json({ success: true, content: data.results });
  } catch (error) {
    // Log the error for server-side tracking
    console.error(`Error fetching similar TV shows for ${id}:`, error);

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

    // Return the list of recommended TV shows
    res.status(200).json({ success: true, content: data.results });
  } catch (error) {
    // Log the error for server-side tracking
    console.error(`Error fetching recommendations for TV show ${id}:`, error);

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

    // Return the list of TV shows in the category
    res.status(200).json({ success: true, content: data.results });
  } catch (error) {
    // Log the error for server-side tracking
    console.error(`Error fetching TV shows in category ${category}:`, error);

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

    // Return the list of keywords
    res.status(200).json({ success: true, content: data.results });
  } catch (error) {
    // Log the error for server-side tracking
    console.error(`Error fetching keywords for TV show ${id}:`, error);

    // Return a 500 Internal Server Error
    res.status(500).json({
      success: false,
      message: "Failed to fetch TV show keywords",
      error: error.message,
    });
  }
}
