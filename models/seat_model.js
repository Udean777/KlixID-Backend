import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
    trim: true,
  },
  row: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["regular", "premium", "vip"],
    default: "regular",
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  showTimeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShowTime",
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
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

seatSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Seat = mongoose.model("Seat", seatSchema);

export default Seat;
