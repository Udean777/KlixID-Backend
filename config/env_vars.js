// Import the dotenv library to load environment variables from a .env file
import dotenv from "dotenv";

// Configure dotenv to load environment variables
// This allows reading configuration from a .env file in the project root
dotenv.config();

// Export a centralized configuration object with environment variables
// This approach provides a single, consistent way to access environment-specific configurations
export const ENV_VARS = {
  // MongoDB connection URI for database connection
  // Stores the database connection string from the environment variables
  MONGO_URI: process.env.MONGO_URI,

  // Server port number
  // Uses the PORT from environment variables, defaults to 5000 if not specified
  PORT: process.env.PORT || 5000,

  // JSON Web Token (JWT) secret key for authentication
  // Used for signing and verifying authentication tokens
  JWT_SECRET: process.env.JWT_SECRET,

  // Node.js environment mode (development, production, test)
  // Helps in configuring app behavior based on the current environment
  NODE_ENV: process.env.NODE_ENV,

  // API key for The Movie Database (TMDB)
  // Used for authenticating requests to the TMDB API
  TMDB_READ_API_KEY: process.env.TMDB_READ_API_KEY,
};
