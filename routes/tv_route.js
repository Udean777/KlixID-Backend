import express from "express";
import {
  getSimilarTvs,
  getTrendingTv,
  getTvDetails,
  getTvsByCategory,
  getTvTrailers,
  getPopularTv,
  getRecommendationTvs,
  getTvKeywords,
} from "../controllers/tv_controller.js";

const tvRoutes = express.Router();

/**
 * @route GET /api/tv/trending
 * @desc Retrieve top trending TV shows
 * @access Public
 */
tvRoutes.get("/trending", getTrendingTv);

/**
 * @route GET /api/tv/popular
 * @desc Retrieve popular TV shows
 * @access Public
 */
tvRoutes.get("/popular", getPopularTv);

/**
 * @route GET /api/tv/:id/trailers
 * @desc Get trailers for a specific TV show
 * @access Public
 */
tvRoutes.get("/:id/trailers", getTvTrailers);

/**
 * @route GET /api/tv/:id/details
 * @desc Retrieve detailed information about a specific TV show
 * @access Public
 */
tvRoutes.get("/:id/details", getTvDetails);

/**
 * @route GET /api/tv/:id/similar
 * @desc Get TV shows similar to a specific TV show
 * @access Public
 */
tvRoutes.get("/:id/similar", getSimilarTvs);

/**
 * @route GET /api/tv/:id/recommendations
 * @desc Get recommended TV shows based on a specific TV show
 * @access Public
 */
tvRoutes.get("/:id/recommendations", getRecommendationTvs);

/**
 * @route GET /api/tv/:id/keywords
 * @desc Retrieve keywords associated with a specific TV show
 * @access Public
 */
tvRoutes.get("/:id/keywords", getTvKeywords);

/**
 * @route GET /api/tv/:category
 * @desc Retrieve TV shows by category (e.g., top_rated, on_the_air)
 * @access Public
 */
tvRoutes.get("/:category", getTvsByCategory);

export default tvRoutes;
