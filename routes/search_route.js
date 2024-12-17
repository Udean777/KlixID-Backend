// Import express framework to create routes
import express from "express";

// Import controller functions from the search_controller.js file
import {
  getSearchHistory,
  removeItemFromSearchHistory,
  searchMovies,
  searchPerson,
  searchTvShows,
} from "../controllers/search_controller.js";

// Create a new router instance for search-related routes
const searchRoutes = express.Router();

// Route for searching persons by name
// Endpoint: GET /person/:query
// Requires a search query as a parameter to find persons matching the query
searchRoutes.get("/person/:query", searchPerson);

// Route for searching movies by title
// Endpoint: GET /movie/:query
// Requires a search query as a parameter to find movies matching the query
searchRoutes.get("/movie/:query", searchMovies);

// Route for searching TV shows by title
// Endpoint: GET /tv/:query
// Requires a search query as a parameter to find TV shows matching the query
searchRoutes.get("/tv/:query", searchTvShows);

// Route for retrieving the search history of the authenticated user
// Endpoint: GET /history
// Returns the search history stored in the user's profile
searchRoutes.get("/history", getSearchHistory);

// Route for deleting a specific item from the search history
// Endpoint: DELETE /history/:id
// Requires an item ID as a parameter to remove that specific search record
searchRoutes.delete("/history/:id", removeItemFromSearchHistory);

// Export the configured search routes to be used in the main application
export default searchRoutes;
