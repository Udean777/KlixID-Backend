// Import necessary dependencies and modules
import { User } from "../models/user_model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndCookies } from "../utils/generate_token.js";

// User SignUp Controller
export const signUp = async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Validation: Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
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
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    // Check if user with the same email already exists
    const existUserByEmail = await User.findOne({ email: email });
    if (existUserByEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
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
  } catch (e) {
    // Handle any unexpected errors during signup
    console.log("Error in signup controller", e.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// User SignIn Controller
export const signIn = async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Validation: Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if user exists with the provided email
    const existUserByEmail = await User.findOne({ email: email });
    if (!existUserByEmail) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Compare provided password with stored hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existUserByEmail.password
    );
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
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
  } catch (e) {
    // Handle any unexpected errors during signin
    console.log("Error in login controller", e.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// User SignOut Controller
export const signOut = async (req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie("jwt-klixid");

    // Send successful logout response
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (e) {
    // Handle any unexpected errors during logout
    console.log("Error in logout controller", e.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Authentication Check Controller
export const authCheck = async (req, res) => {
  try {
    // Log the authenticated user
    console.log(`Req user: ${req.user}`);

    // Send the authenticated user details
    res.status(200).json({ success: true, user: req.user });
  } catch (e) {
    // Handle any unexpected errors during auth check
    console.log("Error in authCheck controller", e.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
