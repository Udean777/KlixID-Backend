import express from "express";
import { protectRoute } from "../middleware/auth_middleware.js";
import {
  getMovieShowtimes,
  getAvailableSeats,
  createBooking,
  getBookingDetails,
  cancelBooking,
  getUserBookings,
} from "../controllers/booking_controller.js";

const ticketRoutes = express.Router();

// Public routes for viewing showtimes and seats
ticketRoutes.get("/movies/:movieId/showtimes", getMovieShowtimes);
ticketRoutes.get("/showtimes/:showtimeId/seats", getAvailableSeats);

// Protected routes that require authentication
// Booking Management
ticketRoutes.post("/bookings", protectRoute, createBooking);
ticketRoutes.get("/bookings/:bookingId", protectRoute, getBookingDetails);
ticketRoutes.put("/bookings/:bookingId/cancel", protectRoute, cancelBooking);
ticketRoutes.get("/users/bookings", protectRoute, getUserBookings);

export default ticketRoutes;
