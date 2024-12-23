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
 */
movieRoutes.get("/trending", getTrendingMovies);

/**
 * Fetch currently playing movies
 * @route GET /nowplaying
 */
movieRoutes.get("/nowplaying", getNowPlayingMovies);

/**
 * Fetch movie trailer
 * @route GET /:id/trailer
 * @param {string} id - Movie ID
 */
movieRoutes.get("/:id/trailer", getMovieTrailer);

/**
 * Fetch movie details
 * @route GET /:id/details
 * @param {string} id - Movie ID
 */
movieRoutes.get("/:id/details", getMovieDetails);

/**
 * Fetch similar movies
 * @route GET /:id/similar
 * @param {string} id - Movie ID
 */
movieRoutes.get("/:id/similar", getSimilarMovies);

/**
 * Fetch movie recommendations
 * @route GET /:id/recommendations
 * @param {string} id - Movie ID
 */
movieRoutes.get("/:id/recommendations", getRecommendationMovies);

/**
 * Fetch movies by category
 * @route GET /:category
 * @param {string} category - Movie category (popular, top_rated, upcoming)
 */
movieRoutes.get("/:category", getMoviesByCategory);

export default movieRoutes;
