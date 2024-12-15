import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/env_vars.js";

export const generateTokenAndCookies = (userId, res) => {
  const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: "15d" });

  res.cookie("jwt-klixid", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks, make it not be accessed by JS
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: ENV_VARS.NODE_ENV !== "development",
  });

  return token;
};
