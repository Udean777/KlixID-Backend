import { User } from "../models/user_model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndCookies } from "../utils/generate_token.js";

export const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const existUserByEmail = await User.findOne({ email: email });
    if (existUserByEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password, salt);

    const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];

    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    const newUser = new User({
      email,
      password: hashedPw,
      image,
    });

    const token = generateTokenAndCookies(newUser._id, res);
    await newUser.save();

    res.status(201).json({
      success: true,
      user: {
        ...newUser._doc,
        token: token,
      },
    });
  } catch (e) {
    console.log("Error in signup controller", e.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existUserByEmail = await User.findOne({ email: email });
    if (!existUserByEmail) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existUserByEmail.password
    );
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateTokenAndCookies(existUserByEmail._id, res);

    res.status(200).json({
      success: true,
      user: {
        ...existUserByEmail._doc,
        token: token,
      },
    });
  } catch (e) {
    console.log("Error in login controller", e.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("jwt-klixid");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (e) {
    console.log("Error in logout controller", e.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const authCheck = async (req, res) => {
  try {
    console.log(`Req user: ${req.user}`);
    res.status(200).json({ success: true, user: req.user });
  } catch (e) {
    console.log("Error in authCheck controller", e.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
