// Import Mongoose library for MongoDB schema and model creation
import mongoose from "mongoose";

// Define the User schema
// Describes the structure and validation rules for user documents in the database
const userSchema = mongoose.Schema({
  // Email field configuration
  email: {
    type: String, // Specifies the data type as String
    required: true, // Makes the email a mandatory field
    unique: true, // Ensures no duplicate email addresses in the database
  },

  // Password field configuration
  password: {
    type: String, // Specifies the data type as String
    required: true, // Makes the password a mandatory field
  },

  // Profile image field configuration
  image: {
    type: String, // Specifies the data type as String
    default: "", // Provides an empty string as default value if no image is set
  },

  // Search history field configuration
  searchHistory: {
    type: Array, // Allows storing an array of search items
    default: [], // Initializes with an empty array if no search history exists
  },
});

// Create and export the User model
// This model provides an interface to interact with the 'users' collection in MongoDB
export const User = mongoose.model("User", userSchema);
