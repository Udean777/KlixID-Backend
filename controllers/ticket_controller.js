import { TMDBService } from "../services/tmdb_service.js";

import Booking from "../models/booking_model.js";
import ShowTime from "../models/showtime_model.js";
import Seat from "../models/seat_model.js";

/**
 * Get available showtimes for a specific movie
 * @route GET /showtimes/:movieId
 * @param {string} movieId - TMDB Movie ID
 */
export const getMovieShowtimes = async (req, res) => {
  const { movieId } = req.params;

  try {
    // Validate movie existence in TMDB
    const movieData = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`
    );

    // Get showtimes from your database
    const showtimes = await ShowTime.find({
      movieId,
      startTime: { $gt: new Date() }, // Only future showtimes
    }).sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      movie: movieData,
      showtimes,
    });
  } catch (error) {
    console.error(`Error in getMovieShowtimes: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Unable to fetch showtimes",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get available seats for a specific showtime
 * @route GET /showtime/:showtimeId/seats
 * @param {string} showtimeId - Showtime ID
 */
export const getAvailableSeats = async (req, res) => {
  const { showtimeId } = req.params;

  try {
    const showtime = await ShowTime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: "Showtime not found",
      });
    }

    // Get all seats and their booking status
    const seats = await Seat.find({ showtimeId }).sort({ seatNumber: 1 });

    res.status(200).json({
      success: true,
      showtime,
      seats,
    });
  } catch (error) {
    console.error(`Error in getAvailableSeats: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Unable to fetch available seats",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Create a new ticket booking
 * @route POST /bookings
 * @param {Object} body - Booking details
 */
export const createBooking = async (req, res) => {
  const { userId, movieId, showtimeId, seatIds, paymentMethod, totalAmount } =
    req.body;

  try {
    // Validate required fields
    if (
      !userId ||
      !movieId ||
      !showtimeId ||
      !seatIds ||
      seatIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required booking information",
      });
    }

    // Check if seats are still available
    const seats = await Seat.find({
      _id: { $in: seatIds },
      isBooked: false,
    });

    if (seats.length !== seatIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more selected seats are no longer available",
      });
    }

    // Create booking transaction
    const booking = await Booking.create({
      userId,
      movieId,
      showtimeId,
      seats: seatIds,
      paymentMethod,
      totalAmount,
      status: "pending",
      bookingDate: new Date(),
    });

    // Update seat status
    await Seat.updateMany(
      { _id: { $in: seatIds } },
      { $set: { isBooked: true, bookingId: booking._id } }
    );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error(`Error in createBooking: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Unable to create booking",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get booking details
 * @route GET /bookings/:bookingId
 * @param {string} bookingId - Booking ID
 */
export const getBookingDetails = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId)
      .populate("seats")
      .populate("showtime");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Get movie details from TMDB
    const movieData = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${booking.movieId}?language=en-US`
    );

    res.status(200).json({
      success: true,
      booking,
      movie: movieData,
    });
  } catch (error) {
    console.error(`Error in getBookingDetails: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Unable to fetch booking details",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Cancel a booking
 * @route PUT /bookings/:bookingId/cancel
 * @param {string} bookingId - Booking ID
 */
export const cancelBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if booking can be cancelled (e.g., not too close to showtime)
    const showtime = await ShowTime.findById(booking.showTimeId);
    const hoursUntilShowtime =
      (showtime.startTime - new Date()) / (1000 * 60 * 60);

    if (hoursUntilShowtime < 2) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel booking less than 2 hours before showtime",
      });
    }

    // Update booking status
    booking.status = "cancelled";
    await booking.save();

    // Release the seats
    await Seat.updateMany(
      { bookingId: bookingId },
      { $set: { isBooked: false, bookingId: null } }
    );

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error(`Error in cancelBooking: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Unable to cancel booking",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get user's booking history
 * @route GET /users/:userId/bookings
 * @param {string} userId - User ID
 */
export const getUserBookings = async (req, res) => {
  const { userId } = req.params;

  try {
    const bookings = await Booking.find({ userId })
      .populate("seats")
      .populate("showtime")
      .sort({ bookingDate: -1 });

    // Get movie details for each booking
    const bookingsWithMovies = await Promise.all(
      bookings.map(async (booking) => {
        const movieData = await fetchFromTMDB(
          `https://api.themoviedb.org/3/movie/${booking.movieId}?language=en-US`
        );
        return {
          ...booking.toObject(),
          movie: movieData,
        };
      })
    );

    res.status(200).json({
      success: true,
      bookings: bookingsWithMovies,
    });
  } catch (error) {
    console.error(`Error in getUserBookings: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Unable to fetch user bookings",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
