// Import necessary dependencies and modules
import { User } from "../models/user_model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndCookies } from "../utils/generate_token.js";

/**
 * User SignUp Controller
 * @route POST /auth/signup
 * @param {Object} req.body - User registration details
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @returns {Object} Created user details and authentication token
 */
export const signUp = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Validate fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Only allow super_admin to create admin accounts
    if (role && ["admin", "super_admin"].includes(role)) {
      if (!req.user || req.user.role !== "super_admin") {
        return res.status(403).json({
          success: false,
          message: "Unauthorized to create admin accounts",
        });
      }
    }

    // Validation: Minimum password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Validation: Email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Check if user with the same email already exists
    const existUserByEmail = await User.findOne({ email: email });
    if (existUserByEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    // Generate salt and hash the password for secure storage
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password, salt);

    // Define a set of default profile pictures
    const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];

    // Randomly select a profile picture
    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    // Create a new user object
    const newUser = new User({
      email,
      password: hashedPw,
      firstName,
      lastName,
      role: role || "user",
      image,
    });

    // Generate authentication token and set cookies
    const token = generateTokenAndCookies(newUser._id, res);

    // Save the new user to the database
    await newUser.save();

    // Send successful response with user details
    res.status(201).json({
      success: true,
      user: {
        ...newUser._doc,
        token: token,
      },
    });
  } catch (error) {
    // Log the error for server-side tracking
    console.error("Error in signup controller:", error.message);

    // Handle Mongoose validation errors with detailed feedback
    if (error.name === "ValidationError") {
      return res.status(422).json({
        success: false,
        message: "Invalid user data provided",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    // Handle duplicate key errors (e.g., duplicate email)
    if (error.name === "MongoServerError" && error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Return a 503 Service Unavailable for other server errors
    res.status(503).json({
      success: false,
      message: "Service temporarily unavailable. Please try again later.",
      // Only include detailed error in development environment
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * User SignIn Controller
 * @route POST /auth/signin
 * @param {Object} req.body - User login credentials
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @returns {Object} Authenticated user details and token
 */
export const signIn = async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Validation: Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if user exists with the provided email
    const existUserByEmail = await User.findOne({ email: email });
    if (!existUserByEmail) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare provided password with stored hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existUserByEmail.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate authentication token and set cookies
    const token = generateTokenAndCookies(existUserByEmail._id, res);

    // Send successful response with user details
    res.status(200).json({
      success: true,
      user: {
        ...existUserByEmail._doc,
        token: token,
      },
    });
  } catch (error) {
    // Log the error for server-side tracking
    console.error("Error in login controller:", error.message);

    // Handle database connection errors
    if (error.name === "MongooseError") {
      return res.status(503).json({
        success: false,
        message: "Database connection error. Please try again later.",
      });
    }

    // Handle JWT token generation errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. Please try logging in again.",
      });
    }

    // Return a 503 Service Unavailable for other server errors
    res.status(503).json({
      success: false,
      message: "Service temporarily unavailable. Please try again later.",
      // Only include detailed error in development environment
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * User SignOut Controller
 * @route POST /auth/signout
 * @returns {Object} Logout confirmation
 */
export const signOut = async (req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie("jwt-klixid");

    // Send successful logout response
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    // Log the error for server-side tracking
    console.error("Error in logout controller:", error.message);

    // Handle invalid token or session errors
    if (error.name === "TokenError") {
      return res.status(400).json({
        success: false,
        message: "Invalid session. Already logged out.",
      });
    }

    // Return a 503 Service Unavailable for other server errors
    res.status(503).json({
      success: false,
      message: "Unable to complete logout. Please try again.",
      // Only include detailed error in development environment
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Authentication Check Controller
 * @route GET /auth/check
 * @returns {Object} Authenticated user details
 */
export const authCheck = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // Update last login
    await User.findByIdAndUpdate(req.user._id, {
      lastLogin: new Date(),
    });

    res.status(200).json({
      success: true,
      user: {
        ...req.user._doc,
        isAdmin: ["admin", "super_admin"].includes(req.user.role),
      },
    });
  } catch (error) {
    // Log the error for server-side tracking
    console.error("Error in authCheck controller:", error.message);

    // Handle expired JWT token errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    // Handle invalid JWT token errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token. Please login again.",
      });
    }

    // Return a 503 Service Unavailable for other server errors
    res.status(503).json({
      success: false,
      message:
        "Unable to verify authentication status. Please try again later.",
      // Only include detailed error in development environment
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
