import express from "express";
import { protectRoute } from "../middleware/auth_middleware.js";
import { isAdmin } from "../middleware/admin_middleware.js";

const adminThRoute = express.Router();

// Assuming we have these controller functions in an admin controller
import {
  createShowtime,
  updateShowtime,
  deleteShowtime,
  createSeat,
  updateSeat,
  deleteSeat,
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
adminThRoute.put("/seats/:seatId", updateSeat);
adminThRoute.delete("/seats/:seatId", deleteSeat);

// Statistics and Reports
adminThRoute.get("/stats/theater", getTheaterStats);
adminThRoute.get("/stats/bookings", getBookingStats);

export default adminThRoute;
