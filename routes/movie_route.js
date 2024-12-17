// Import express framework to create routes
import express from "express";

// Import route protection middleware
import { protectRoute } from "../middleware/protect_route.js";

// Import movie-related controller functions
import {
  getMovieDetails,
  getMovieTrailer,
  getNowPlayingMovies,
  getSimilarMovies,
  getRecommendationMovies,
  getTrendingMovies,
  getMoviesByCategory,
} from "../controllers/movie_controller.js";

/**
 * Router for movie-related endpoints
 * @module movieRoutes
 */
const movieRoutes = express.Router();

/**
 * Fetch trending movies
 * @route GET /trending
 * @middleware protectRoute - Ensures user authentication
 */
movieRoutes.get("/trending", protectRoute, getTrendingMovies);

/**
 * Fetch currently playing movies
 * @route GET /nowplaying
 * @middleware protectRoute - Ensures user authentication
 */
movieRoutes.get("/nowplaying", protectRoute, getNowPlayingMovies);

/**
 * Fetch movie trailer
 * @route GET /:id/trailer
 * @param {string} id - Movie ID
 * @middleware protectRoute - Ensures user authentication
 */
movieRoutes.get("/:id/trailer", protectRoute, getMovieTrailer);

/**
 * Fetch movie details
 * @route GET /:id/details
 * @param {string} id - Movie ID
 * @middleware protectRoute - Ensures user authentication
 */
movieRoutes.get("/:id/details", protectRoute, getMovieDetails);

/**
 * Fetch similar movies
 * @route GET /:id/similar
 * @param {string} id - Movie ID
 * @middleware protectRoute - Ensures user authentication
 */
movieRoutes.get("/:id/similar", protectRoute, getSimilarMovies);

/**
 * Fetch movie recommendations
 * @route GET /:id/recommendations
 * @param {string} id - Movie ID
 * @middleware protectRoute - Ensures user authentication
 */
movieRoutes.get("/:id/recommendations", protectRoute, getRecommendationMovies);

/**
 * Fetch movies by category
 * @route GET /:category
 * @param {string} category - Movie category (popular, top_rated, upcoming)
 * @middleware protectRoute - Ensures user authentication
 */
movieRoutes.get("/:category", protectRoute, getMoviesByCategory);

export default movieRoutes;
