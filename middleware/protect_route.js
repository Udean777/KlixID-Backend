import jwt from "jsonwebtoken";
import { User } from "../models/user_model.js";
import { ENV_VARS } from "../config/env_vars.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers["Authorization"];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token.split(" ")[1], ENV_VARS.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;

    next();
  } catch (e) {
    console.log("Error in protect_route middleware: ", e.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
