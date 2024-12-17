// Import express framework to create routes
import express from "express";

// Import route protection middleware
import { protectRoute } from "../middleware/protect_route.js";

// Import authentication controllers
import {
  authCheck,
  signIn,
  signOut,
  signUp,
} from "../controllers/auth_controller.js";

/**
 * Router for authentication-related endpoints
 * @module authRoutes
 */
const authRoutes = express.Router();

/**
 * User sign-in
 * @route POST /signin
 * @description Authenticate user credentials and generate token
 */
authRoutes.post("/signin", signIn);

/**
 * User sign-up
 * @route POST /signup
 * @description Register a new user account
 */
authRoutes.post("/signup", signUp);

/**
 * User sign-out
 * @route GET /signout
 * @description Log out user and clear authentication token
 */
authRoutes.get("/signout", signOut);

/**
 * Check authentication status
 * @route GET /authcheck
 * @middleware protectRoute - Ensures user authentication
 * @description Verify and return current authenticated user information
 */
authRoutes.get("/authcheck", protectRoute, authCheck);

export default authRoutes;
