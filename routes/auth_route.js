// Import necessary dependencies
import express from "express";

// Import authentication controllers
import {
  authCheck, // Controller to check current authentication status
  signIn, // Controller for user login
  signOut, // Controller for user logout
  signUp, // Controller for user registration
} from "../controllers/auth_controller.js";

// Import route protection middleware
import { protectRoute } from "../middleware/protect_route.js";

// Create an Express router for authentication-related routes
const authRoutes = express.Router();

// Route for user sign-in
// HTTP Method: POST
// Endpoint: /signin
// Handles user authentication and login process
authRoutes.post("/signin", signIn);

// Route for user sign-up
// HTTP Method: POST
// Endpoint: /signup
// Handles new user registration
authRoutes.post("/signup", signUp);

// Route for user sign-out
// HTTP Method: GET
// Endpoint: /signout
// Handles user logout and clears authentication tokens
authRoutes.get("/signout", signOut);

// Route for authentication status check
// HTTP Method: GET
// Endpoint: /authcheck
// Uses protectRoute middleware to ensure only authenticated users can access
// Returns the current authenticated user's information
authRoutes.get("/authcheck", protectRoute, authCheck);

// Export the authentication routes to be used in the main Express application
export default authRoutes;
