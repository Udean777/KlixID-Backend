// Import the Mongoose library for MongoDB interactions
import mongoose from "mongoose";

// Import environment variables configuration
import { ENV_VARS } from "./env_vars.js";

// Async function to establish a connection to the MongoDB database
export const connectDb = async () => {
  try {
    // Attempt to connect to the MongoDB database using the URI from environment variables
    // mongoose.connect returns a connection object if successful
    const connect = await mongoose.connect(ENV_VARS.MONGO_URI);

    // Log a success message with the database host information
    // This helps in confirming the successful database connection
    console.log(`Mongodb successfully connected!: ${connect.connection.host}`);
  } catch (e) {
    // Error handling for database connection failures
    // Logs the specific error message
    console.error(`Error connecting to mongodb: ${e.message}`);

    // Terminate the Node.js process with a failure status code (1)
    // This prevents the application from running without a database connection
    process.exit(1);
  }
};
