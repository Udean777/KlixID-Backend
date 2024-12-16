// Import required libraries and modules
import jwt from "jsonwebtoken";
import { User } from "../models/user_model.js";
import { ENV_VARS } from "../config/env_vars.js";

// Middleware to protect routes and verify user authentication
export const protectRoute = async (req, res, next) => {
  try {
    // Extract the authorization token from request headers
    // Expecting format: "Bearer <token>"
    const token = req.headers["Authorization"];

    // Check if token exists
    if (!token) {
      // If no token is provided, return unauthorized error
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No Token Provided" });
    }

    // Verify the token
    // Split the token to remove "Bearer " prefix and verify using JWT secret
    const decoded = jwt.verify(token.split(" ")[1], ENV_VARS.JWT_SECRET);

    // Additional check to ensure token was successfully decoded
    if (!decoded) {
      // If token is invalid, return unauthorized error
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid Token" });
    }

    // Find the user associated with the token
    // Exclude password from the returned user object for security
    const user = await User.findById(decoded.userId).select("-password");

    // Check if user exists
    if (!user) {
      // If no user found, return not found error
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Attach the user object to the request for further route handling
    // This allows subsequent middleware or route handlers to access user info
    req.user = user;

    // Move to the next middleware or route handler
    next();
  } catch (e) {
    // Handle any errors during the authentication process
    console.log("Error in protect_route middleware: ", e.message);

    // Return internal server error if something unexpected occurs
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
