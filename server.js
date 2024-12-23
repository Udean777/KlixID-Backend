// Import express framework to create a web application
import express from "express";
// Import environment variables from configuration file
import { ENV_VARS } from "./config/env_vars.js";
// Import function to connect to the database
import { connectDb } from "./config/db.js";
// Import middleware for parsing cookies
import cookieParser from "cookie-parser";

// Import routes related to authentication
import authRoutes from "./routes/auth_route.js";
// Import routes related to movies
import movieRoutes from "./routes/movie_route.js";
// Import routes related to search
import searchRoutes from "./routes/search_route.js";
// Import routes related to TV shows
import tvRoutes from "./routes/tv_route.js";
// Import routes related to ticket
import ticketRoutes from "./routes/ticket_route.js";
// import routes related to admin
import adminThRoute from "./routes/admin_theater_route.js";

// Create an Express application instance
const app = express();

// Define application port from environment variables
const PORT = ENV_VARS.PORT;

// Middleware for parsing JSON data from request body
app.use(express.json());

// Middleware for parsing cookies sent by the client
app.use(cookieParser());

// Set up routes for authentication
app.use("/api/v1/auth", authRoutes);
// Set up routes for movies
app.use("/api/v1/movies", movieRoutes);
// Set up routes for search
app.use("/api/v1/search", searchRoutes);
// Set up routes for TV shows
app.use("/api/v1/tv", tvRoutes);
// Set up routes for ticket
app.use("/api/v1/ticket", ticketRoutes);
// Set up routes for admin
app.use("/api/v1/admin", adminThRoute);

// Production configuration
if (ENV_VARS.NODE_ENV === "production") {
  // Define static folder for built frontend files
  app.use(express.static(path.join(__dirname, "/dist")));

  // Handle all requests not matching API routes
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
  });
}

// Start the server on the specified port
app.listen(PORT, () => {
  // Connect to the database when the server starts
  connectDb();

  // Display a message indicating the server is running
  console.log(`Server is running on PORT http://localhost:${PORT}`);
});
