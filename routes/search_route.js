// Import express framework to create routes
import express from "express";

// Import controller functions from the search controller
import {
  getSearchHistory,
  removeItemFromSearchHistory,
  searchMovies,
  searchPerson,
  searchTvShows,
} from "../controllers/search_controller.js";

/**
 * Router for search-related endpoints
 * @module searchRoutes
 */
const searchRoutes = express.Router();

/**
 * Search for persons by name
 * @route GET /person/:query
 * @param {string} query - Search term for persons
 */
searchRoutes.get("/person/:query", searchPerson);

/**
 * Search for movies by title
 * @route GET /movie/:query
 * @param {string} query - Search term for movies
 */
searchRoutes.get("/movie/:query", searchMovies);

/**
 * Search for TV shows by title
 * @route GET /tv/:query
 * @param {string} query - Search term for TV shows
 */
searchRoutes.get("/tv/:query", searchTvShows);

/**
 * Retrieve user's search history
 * @route GET /history
 */
searchRoutes.get("/history", getSearchHistory);

/**
 * Remove a specific item from search history
 * @route DELETE /history/:id
 * @param {string} id - ID of the search history item to remove
 */
searchRoutes.delete("/history/:id", removeItemFromSearchHistory);

export default searchRoutes;
