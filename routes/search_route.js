import express from "express";
import {
  getSearchHistory,
  removeItemFromSearchHistory,
  searchMovies,
  searchPerson,
  searchTvShows,
} from "../controllers/search_controller.js";

const searchRoutes = express.Router();

router.get("/person/:query", searchPerson);
router.get("/movie/:query", searchMovies);
router.get("/tv/:query", searchTvShows);
router.get("/history", getSearchHistory);
router.delete("/history/:id", removeItemFromSearchHistory);

export default searchRoutes;
