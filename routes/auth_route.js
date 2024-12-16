import express from "express";
import {
  authCheck,
  signIn,
  signOut,
  signUp,
} from "../controllers/auth_controller.js";
import { protectRoute } from "../middleware/protect_route.js";

const authRoutes = express.Router();

authRoutes.post("/signin", signIn);
authRoutes.post("/signup", signUp);
authRoutes.get("/signout", signOut);
authRoutes.get("/authcheck", protectRoute, authCheck);

export default authRoutes;
