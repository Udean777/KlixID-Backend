import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/env_vars.js";

// Function to generate a JWT token and set it as a cookie in the response
export const generateTokenAndCookies = (userId, res) => {
  // Generate a JWT token with the user ID as payload, using a secret key and expiration time of 15 days
  const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, {
    expiresIn: "15d",
    algorithm: "HS256",
  });

  // Set the generated token as a cookie in the HTTP response
  res.cookie("jwt-klixid", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // Set the cookie's maximum age to 15 days (in milliseconds)
    httpOnly: true, // Restrict cookie access to HTTP requests only to prevent XSS attacks
    sameSite: "strict", // Prevent CSRF attacks by ensuring the cookie is sent only from the same site
    secure: ENV_VARS.NODE_ENV !== "development", // Use HTTPS in production for better security
  });

  // Return the generated token
  return token;
};
