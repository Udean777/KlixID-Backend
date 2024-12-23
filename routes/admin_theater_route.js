import express from "express";
import { protectRoute } from "../middleware/protect_route.js";
import { isAdmin } from "../middleware/is_admin.js";

const adminThRoute = express.Router();

// Assuming we have these controller functions in an admin controller
import {
  createShowtime,
  updateShowtime,
  deleteShowtime,
  createSeat,
  getTheaterStats,
  getBookingStats,
} from "../controllers/admin_controller.js";

// All routes require authentication and admin privileges
adminThRoute.use(protectRoute);
adminThRoute.use(isAdmin);

// Showtime Management
adminThRoute.post("/showtimes", createShowtime);
adminThRoute.put("/showtimes/:showtimeId", updateShowtime);
adminThRoute.delete("/showtimes/:showtimeId", deleteShowtime);

// Seat Management
adminThRoute.post("/seats", createSeat);

// Statistics and Reports
adminThRoute.get("/stats/theater", getTheaterStats);
adminThRoute.get("/stats/bookings", getBookingStats);

export default adminThRoute;
