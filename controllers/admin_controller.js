import { Showtime } from "../models/showtime.model.js";
import { Seat } from "../models/seat.model.js";
import { Booking } from "../models/booking.model.js";
import { User } from "../models/user.model.js";

/**
 * Create a new showtime
 * @route POST /admin/showtimes
 */
export const createShowtime = async (req, res) => {
  try {
    const {
      movieId,
      startTime,
      endTime,
      theater,
      screenType,
      language,
      basePrice,
    } = req.body;

    const newShowtime = new Showtime({
      movieId,
      startTime,
      endTime,
      theater,
      screenType,
      language,
      basePrice,
      totalSeats: 0,
      availableSeats: 0,
    });

    await newShowtime.save();

    res.status(201).json({
      success: true,
      message: "Showtime created successfully",
      showtime: newShowtime,
    });
  } catch (error) {
    console.error("Error in createShowtime:", error);
    res.status(500).json({
      success: false,
      message: "Unable to create showtime",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Update an existing showtime
 * @route PUT /admin/showtimes/:id
 */
export const updateShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id);

    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: "Showtime not found",
      });
    }

    // Check if showtime has any bookings
    const hasBookings = await Booking.exists({ showtimeId: showtime._id });
    if (hasBookings) {
      return res.status(400).json({
        success: false,
        message: "Cannot update showtime with existing bookings",
      });
    }

    const updatedShowtime = await Showtime.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Showtime updated successfully",
      showtime: updatedShowtime,
    });
  } catch (error) {
    console.error("Error in updateShowtime:", error);
    res.status(500).json({
      success: false,
      message: "Unable to update showtime",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Delete a showtime
 * @route DELETE /admin/showtimes/:id
 */
export const deleteShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id);

    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: "Showtime not found",
      });
    }

    // Check if showtime has any bookings
    const hasBookings = await Booking.exists({ showtimeId: showtime._id });
    if (hasBookings) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete showtime with existing bookings",
      });
    }

    await Showtime.findByIdAndDelete(req.params.id);
    await Seat.deleteMany({ showtimeId: req.params.id });

    res.status(200).json({
      success: true,
      message: "Showtime deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteShowtime:", error);
    res.status(500).json({
      success: false,
      message: "Unable to delete showtime",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Create seats for a showtime
 * @route POST /admin/seats
 */
export const createSeat = async (req, res) => {
  try {
    const { showtimeId, seats } = req.body;

    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: "Showtime not found",
      });
    }

    const createdSeats = await Seat.insertMany(
      seats.map((seat) => ({
        ...seat,
        showtimeId,
        isBooked: false,
      }))
    );

    // Update showtime's total and available seats
    showtime.totalSeats += createdSeats.length;
    showtime.availableSeats += createdSeats.length;
    await showtime.save();

    res.status(201).json({
      success: true,
      message: "Seats created successfully",
      seats: createdSeats,
    });
  } catch (error) {
    console.error("Error in createSeat:", error);
    res.status(500).json({
      success: false,
      message: "Unable to create seats",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get theater statistics
 * @route GET /admin/stats/theater
 */
export const getTheaterStats = async (req, res) => {
  try {
    const stats = {
      totalShowtimes: await Showtime.countDocuments(),
      activeShowtimes: await Showtime.countDocuments({
        startTime: { $gt: new Date() },
      }),
      totalBookings: await Booking.countDocuments(),
      totalRevenue: await Booking.aggregate([
        { $match: { paymentStatus: "completed" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      occupancyRate: await calculateOccupancyRate(),
      popularMovies: await getPopularMovies(),
    };

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error in getTheaterStats:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch theater statistics",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get booking statistics
 * @route GET /admin/stats/bookings
 */
export const getBookingStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const stats = {
      totalBookings: await Booking.countDocuments(query),
      completedBookings: await Booking.countDocuments({
        ...query,
        bookingStatus: "completed",
      }),
      cancelledBookings: await Booking.countDocuments({
        ...query,
        bookingStatus: "cancelled",
      }),
      revenue: await Booking.aggregate([
        { $match: { ...query, paymentStatus: "completed" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      paymentMethods: await getPaymentMethodStats(query),
      dailyBookings: await getDailyBookingStats(query),
    };

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error in getBookingStats:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch booking statistics",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Helper functions
const calculateOccupancyRate = async () => {
  const showtimes = await Showtime.find({
    endTime: { $gt: new Date() },
  });

  if (showtimes.length === 0) return 0;

  const totalOccupancy = showtimes.reduce((acc, showtime) => {
    return (
      acc +
      (showtime.totalSeats - showtime.availableSeats) / showtime.totalSeats
    );
  }, 0);

  return (totalOccupancy / showtimes.length) * 100;
};

const getPopularMovies = async () => {
  return await Booking.aggregate([
    { $match: { bookingStatus: "completed" } },
    { $group: { _id: "$movieId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);
};

const getPaymentMethodStats = async (query) => {
  return await Booking.aggregate([
    { $match: { ...query, paymentStatus: "completed" } },
    { $group: { _id: "$paymentMethod", count: { $sum: 1 } } },
  ]);
};

const getDailyBookingStats = async (query) => {
  return await Booking.aggregate([
    { $match: query },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
        revenue: {
          $sum: {
            $cond: [
              { $eq: ["$paymentStatus", "completed"] },
              "$totalAmount",
              0,
            ],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};
