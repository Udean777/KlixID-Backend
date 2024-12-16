// Import necessary dependencies
import express from "express";

// Import all movie-related controller functions from the movie controller
import {
  getMovieDetails,
  getMovieTrailer,
  getNowPlayingMovies,
  getSimilarMovies,
  getRecommendationMovies,
  getTrendingMovies,
  getMoviesByCategory,
} from "../controllers/movie_controller.js";

// Create an Express router specifically for movie-related routes
const movieRoutes = express.Router();

// Route for fetching trending movies
// Endpoint: GET /trending
// Returns the top trending movies of the day
movieRoutes.get("/trending", getTrendingMovies);

// Route for fetching currently playing movies
// Endpoint: GET /nowplaying
// Returns movies currently in theaters
movieRoutes.get("/nowplaying", getNowPlayingMovies);

// Route for fetching a movie's trailer
// Endpoint: GET /:id/trailer
// Requires a movie ID to retrieve its trailer
movieRoutes.get("/:id/trailer", getMovieTrailer);

// Route for fetching detailed information about a specific movie
// Endpoint: GET /:id/details
// Requires a movie ID to retrieve comprehensive movie details
movieRoutes.get("/:id/details", getMovieDetails);

// Route for fetching movies similar to a specific movie
// Endpoint: GET /:id/similar
// Requires a movie ID to find similar movies
movieRoutes.get("/:id/similar", getSimilarMovies);

// Route for fetching movie recommendations based on a specific movie
// Endpoint: GET /:id/recommendations
// Requires a movie ID to generate personalized movie recommendations
movieRoutes.get("/:id/recommendations", getRecommendationMovies);

// Route for fetching movies by category
// Endpoint: GET /:category
// Allows retrieving movies from different categories like popular, top_rated, upcoming
movieRoutes.get("/:category", getMoviesByCategory);

// Export the movie routes to be used in the main Express application
export default movieRoutes;
