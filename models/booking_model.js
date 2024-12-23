import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  showTimeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShowTime",
    required: true,
  },
  seats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seat",
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "debit_card", "e_wallet", "bank_transfer"],
    required: true,
  },
  bookingStatus: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true,
  },
  specialRequests: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

bookingSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

bookingSchema.pre("save", async function (next) {
  if (!this.bookingCode) {
    // Generate a unique booking code (format: YYYYMMDD-XXXX)
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(1000 + Math.random() * 9000);
    this.bookingCode = `${date}-${random}`;
  }
  next();
});

bookingSchema.virtual("bookingDuration").get(async function () {
  try {
    const showtime = await mongoose.model("Showtime").findById(this.showtimeId);
    if (showtime) {
      return (showtime.endTime - showtime.startTime) / (1000 * 60); // Duration in minutes
    }
    return null;
  } catch (error) {
    return null;
  }
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
