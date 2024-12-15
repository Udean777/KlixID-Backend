import express from "express";
import {
  authCheck,
  signIn,
  signOut,
  signUp,
} from "../controllers/auth_controller.js";
import { protectRoute } from "../middleware/protect_route.js";

const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.get("/signout", signOut);
router.get("/authcheck", protectRoute, authCheck);

export default router;
