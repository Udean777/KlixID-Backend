// Import necessary dependencies
import axios from "axios";
import { ENV_VARS } from "../config/env_vars.js";

// Utility function to fetch data from The Movie Database (TMDB) API
export const fetchFromTMDB = async (url) => {
  // Configure axios request options
  const options = {
    headers: {
      // Specify that we want JSON response
      accept: "application/json",

      // Set Authorization header with TMDB API key
      // Uses environment variable with fallback to process.env
      Authorization: `Bearer ${ENV_VARS.TMDB_READ_API_KEY}`,
    },
  };

  // Make GET request to the specified URL with configured options
  const response = await axios.get(url, options);

  // Validate the response status
  if (response.status !== 200) {
    // Throw an error if the request was not successful
    throw new Error("Failed to fetch data from TMDB" + response.statusText);
  }

  // Return the parsed response data
  return response.data;
};
